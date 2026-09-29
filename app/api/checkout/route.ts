import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { calculateShipping } from "@/lib/pricing";

type CheckoutItemInput = {
  productId: number;
  size: string;
  qty: number;
};

type CustomerInput = {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseItems(value: unknown): CheckoutItemInput[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 50) return null;
  const items: CheckoutItemInput[] = [];
  const seen = new Set<string>();

  for (const item of value) {
    if (!isRecord(item)) return null;
    const { productId, size, qty } = item;
    if (
      !Number.isInteger(productId) || (productId as number) < 1 ||
      typeof size !== "string" || size.length < 1 || size.length > 32 ||
      !Number.isInteger(qty) || (qty as number) < 1 || (qty as number) > 99
    ) return null;

    const key = `${productId}:${size}`;
    if (seen.has(key)) return null;
    seen.add(key);
    items.push({ productId: productId as number, size, qty: qty as number });
  }
  return items;
}

function parseCustomer(value: unknown): CustomerInput | null {
  if (!isRecord(value)) return null;
  const fields = ["name", "email", "address", "city", "postalCode", "country"] as const;
  if (!fields.every((field) => typeof value[field] === "string")) return null;
  const customer = Object.fromEntries(fields.map((field) => [field, (value[field] as string).trim()])) as CustomerInput;
  if (
    customer.name.length < 2 || customer.name.length > 120 ||
    customer.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
    customer.address.length < 3 || customer.address.length > 200 ||
    customer.city.length < 1 || customer.city.length > 100 ||
    customer.postalCode.length < 1 || customer.postalCode.length > 24 ||
    customer.country.length < 2 || customer.country.length > 80
  ) return null;
  return customer;
}

export async function POST(req: NextRequest) {
  let orderId: number | undefined;
  try {
    const body: unknown = await req.json();
    if (!isRecord(body)) return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
    const items = parseItems(body.items);
    const customer = parseCustomer(body.customer);
    if (!items || !customer) {
      return NextResponse.json({ error: "Check your contact, shipping, size, and quantity details." }, { status: 400 });
    }

    const stripe = getStripe();
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((item) => item.productId) } },
    });
    const byId = new Map(products.map((product) => [product.id, product]));
    const orderItems = [];
    for (const item of items) {
      const product = byId.get(item.productId);
      if (!product) {
        return NextResponse.json({ error: "A product in your cart is no longer available." }, { status: 400 });
      }
      if (!product.stock) {
        return NextResponse.json({ error: `${product.name} is sold out.` }, { status: 409 });
      }
      if (!product.sizes.split(",").map((size) => size.trim()).includes(item.size)) {
        return NextResponse.json({ error: `The selected size for ${product.name} is unavailable.` }, { status: 400 });
      }
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        size: item.size,
        qty: item.qty,
      });
    }

    const subtotalCents = orderItems.reduce(
      (total, item) => total + Math.round(item.price * 100) * item.qty,
      0
    );
    const subtotal = subtotalCents / 100;
    const shipping = calculateShipping(subtotal);
    const order = await prisma.order.create({
      data: {
        customerName: customer.name,
        customerEmail: customer.email,
        address: customer.address,
        city: customer.city,
        postalCode: customer.postalCode,
        country: customer.country,
        subtotal,
        shipping,
        total: subtotal + shipping,
        status: "pending",
        items: { create: orderItems },
      },
    });
    orderId = order.id;

    const lineItems = orderItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: `${item.name} (Size ${item.size})` },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Shipping" },
          unit_amount: shipping * 100,
        },
        quantity: 1,
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: customer.email,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      metadata: { orderId: String(order.id) },
    });
    if (!session.url) throw new Error("Stripe did not return a checkout URL.");

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Unable to create checkout session.", error);
    if (orderId !== undefined) {
      try {
        await prisma.order.delete({ where: { id: orderId } });
      } catch (cleanupError) {
        console.error(`Unable to clean up pending order ${orderId}.`, cleanupError);
      }
    }
    const message = error instanceof Error ? error.message : "Checkout could not be started.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
