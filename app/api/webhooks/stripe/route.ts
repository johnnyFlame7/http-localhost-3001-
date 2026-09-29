import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

// Stripe calls this URL automatically when a payment succeeds.
// Register it in your Stripe Dashboard -> Developers -> Webhooks
// pointing at: https://kbrandmusisc.com/api/webhooks/stripe
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    if (!sig || !secret) throw new Error("Missing webhook signature or secret");
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature.";
    return NextResponse.json({ error: `Webhook signature error: ${message}` }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded" ||
    event.type === "checkout.session.expired"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      const orderId = Number(session.metadata?.orderId);
      if (!Number.isInteger(orderId) || orderId < 1) {
        console.error(`Paid Stripe session ${session.id} has invalid order metadata.`);
        return NextResponse.json({ error: "Invalid order metadata." }, { status: 400 });
      }
      const result = await prisma.order.updateMany({
        where: { id: orderId, stripeSessionId: session.id },
        data: { status: "paid" },
      });
      if (result.count === 0) {
        console.error(`No matching order found for paid Stripe session ${session.id}.`);
        return NextResponse.json({ error: "Order not found for this checkout session." }, { status: 404 });
      }
    } else if (event.type === "checkout.session.expired") {
      const orderId = Number(session.metadata?.orderId);
      if (!Number.isInteger(orderId) || orderId < 1) {
        return NextResponse.json({ error: "Invalid order metadata." }, { status: 400 });
      }
      await prisma.order.updateMany({
        where: { id: orderId, stripeSessionId: session.id, status: "pending" },
        data: { status: "cancelled" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
