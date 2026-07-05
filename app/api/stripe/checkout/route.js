import Stripe from "stripe";
import { getRequest } from "../../../../lib/db";

export async function POST(req) {
  const { id } = await req.json();
  const item = await getRequest(id);

  if (!item || !item.quote) {
    return Response.json({ error: "No quote found for this request." }, { status: 400 });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: "Payments aren't configured yet." }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(Number(item.quote) * 100),
          product_data: { name: `Consulting — ${item.id}` },
        },
        quantity: 1,
      },
    ],
    customer_email: item.email,
    metadata: { requestId: item.id },
    success_url: `${process.env.SITE_URL}/request/${item.id}?paid=1`,
    cancel_url: `${process.env.SITE_URL}/request/${item.id}`,
  });

  return Response.json({ url: session.url });
}
