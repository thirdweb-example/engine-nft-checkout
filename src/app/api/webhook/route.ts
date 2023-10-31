import {
  BACKEND_WALLET_ADDRESS,
  NFT_CONTRACT_ADDRESS,
} from "@/consts/addresses";
import { Engine } from "@thirdweb-dev/engine";
import Cors from "micro-cors";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const secret = process.env.WEBHOOK_SECRET_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const signature = headers().get("stripe-signature");

    const event = stripe.webhooks.constructEvent(body, signature!, secret);

    if (event.type === "payment_intent.succeeded") {
      const paymentMethod = event.data.object as any;
      const userWalletAddress = paymentMethod.metadata.address;

      const engine = new Engine({
        url: process.env.ENGINE_URL!,
        accessToken: process.env.THIRDWEB_ACCESS_TOKEN!,
      });

      await engine.erc1155.mintTo(
        "mumbai",
        NFT_CONTRACT_ADDRESS,
        BACKEND_WALLET_ADDRESS,
        {
          metadataWithSupply: {
            metadata: {
              name: "Your NFT",
              description: "Some description",
              image:
                "ipfs://QmciR3WLJsf2BgzTSjbG5zCxsrEQ8PqsHK7JWGWsDSNo46/nft.png",
            },
            supply: "1",
          },
          receiver: userWalletAddress,
        }
      );
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
