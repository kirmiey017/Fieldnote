import Stripe from "stripe";
import { markPaid } from "../../../../lib/db";
import { sendMail } from "../../../../lib/email";

export const runtime = "nodejs";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return Response.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const requestId = session.metadata?.requestId;
    if (requestId) {
      await markPaid(requestId);
      await sendMail(
        process.env.NOTIFY_EMAIL,
        `Payment received — ${requestId}`,
        `The quote for ${requestId} has been paid. Time to kick things off.`
      );
    }
  }

  return Response.json({ received: true });
}
