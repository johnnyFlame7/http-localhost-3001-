import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

const ALLOWED = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

// Admin-only: update an order's status as you pack, ship, and deliver it.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  const { status } = await req.json();
  if (!ALLOWED.includes(status)) {
    return NextResponse.json({ error: `Status must be one of: ${ALLOWED.join(", ")}` }, { status: 400 });
  }
  const order = await prisma.order.update({ where: { id: Number(params.id) }, data: { status } });
  return NextResponse.json(order);
}
