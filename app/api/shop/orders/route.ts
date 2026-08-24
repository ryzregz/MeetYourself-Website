import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Payment stays simulated for now (see README) — this route is called once the
// mocked M-PESA confirmation in ShopClient "succeeds", so every order it creates
// is recorded as already paid. Swap `paymentStatus` to start "pending" here (and
// have a real gateway webhook flip it to "paid") once a payment gateway is wired up.
const orderSchema = z.object({
  bookId: z.string().min(1),
  buyerName: z.string().min(1).optional(),
  buyerEmail: z.string().email().optional(),
  buyerPhone: z.string().min(1).optional(),
  deliveryMethod: z.enum(["email", "whatsapp"]).optional(),
  paymentMethod: z.enum(["mpesa_stk", "mpesa_paybill"]),
  delivery: z
    .object({
      recipientName: z.string().min(1, "Recipient name is required"),
      county: z.string().min(1, "County is required"),
      addressLine: z.string().min(1, "Address is required"),
      coordinates: z.string().optional(),
      phone: z.string().min(1, "Phone number is required"),
    })
    .optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = orderSchema.parse(body);

    const book = await prisma.book.findUnique({ where: { id: data.bookId } });
    if (!book || !book.isActive) {
      return NextResponse.json({ error: "This item is no longer available" }, { status: 400 });
    }
    if (book.physical && !data.delivery) {
      return NextResponse.json({ error: "Delivery details are required for a physical book" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        bookId: book.id,
        bookTitleSnapshot: book.title,
        format: book.format,
        priceKes: book.priceKes,
        buyerName: data.buyerName,
        buyerEmail: data.buyerEmail,
        buyerPhone: data.buyerPhone,
        deliveryMethod: data.deliveryMethod,
        paymentMethod: data.paymentMethod,
        paymentStatus: "paid",
        ...(book.physical && data.delivery
          ? { delivery: { create: data.delivery } }
          : {}),
      },
      include: { delivery: true },
    });

    return NextResponse.json({ id: order.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid data" }, { status: 400 });
    }
    console.error("[api/shop/orders POST]", error);
    return NextResponse.json({ error: "Failed to record order" }, { status: 500 });
  }
}
