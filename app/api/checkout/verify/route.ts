import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "A valid checkout session is required." }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment has not been confirmed yet." }, { status: 409 });
    }
    const orderId = Number(session.metadata?.orderId);
    if (!Number.isInteger(orderId) || orderId < 1) {
      return NextResponse.json({ error: "The order could not be verified." }, { status: 404 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.stripeSessionId !== session.id) {
      return NextResponse.json({ error: "The order could not be verified." }, { status: 404 });
    }
    if (order.status !== "paid") {
      await prisma.order.update({ where: { id: order.id }, data: { status: "paid" } });
    }
    return NextResponse.json({ orderId: order.id, email: order.customerEmail });
  } catch (error) {
    console.error("Unable to verify the completed checkout session.", error);
    const message = error instanceof Error ? error.message : "Order verification failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
