import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-05-27.dahlia" as any,
});

export default stripe;

export async function getStripeSessionDetails(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  return {
    id: session.id,
    customer_email: session.customer_details?.email || session.customer_email,
    customer_name: session.customer_details?.name || session.metadata?.customerName || "Cliente",
    amount_total: session.amount_total,
    payment_status: session.payment_status,
    payment_method: session.payment_method_types?.join(", ") || "Stripe",
    shipping_details: (session as any).shipping_details || (session as any).shipping || session.customer_details,
    line_items: session.line_items?.data,
    cartItems: session.metadata?.cartItems || "[]",
  };
}
