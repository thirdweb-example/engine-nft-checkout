import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const { address } = await req.json();
  const amount = 10000;

  try {
    const payment_intent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "inr",
      description: "Buy your NFT",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: { address },
    });

    return NextResponse.json(
      {
        client_secret: payment_intent.client_secret,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
