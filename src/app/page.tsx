"use client";

import { Elements } from "@stripe/react-stripe-js";
import {
  Appearance,
  StripeElementsOptions,
  loadStripe,
} from "@stripe/stripe-js";
import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractMetadata,
  useNFT,
  MediaRenderer,
  ThirdwebProvider,
} from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { Form } from "../components/Form";
import { NFT_CONTRACT_ADDRESS } from "@/consts/addresses";

export default function Home() {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
    >
      <ClaimPage />
    </ThirdwebProvider>
  );
}

function ClaimPage() {
  const address = useAddress();
  const { contract } = useContract(NFT_CONTRACT_ADDRESS, "edition");
  const { data: contractMetadata } = useContractMetadata(contract);
  const { data: nft } = useNFT(contract, 0);
  const [clientSecret, setClientSecret] = useState("");

  const stripe = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  const appearance: Appearance = {
    theme: "night",
    labels: "above",
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  useEffect(() => {
    if (address) {
      fetch("/api/stripe_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.client_secret);
        });
    }
  }, [address]);

  return (
    <div className={styles.container}>
      {address ? (
        <>
          <p>You are signed in as: {address}</p>
          <div className={styles.nftCard}>
            {contractMetadata && (
              <MediaRenderer
                src={
                  contractMetadata?.image ||
                  nft?.metadata?.image ||
                  "ipfs://QmciR3WLJsf2BgzTSjbG5zCxsrEQ8PqsHK7JWGWsDSNo46/nft.png"
                }
                style={{ width: 200, height: 200 }}
              />
            )}
            <h2>{contractMetadata?.name}</h2>
            <p>{contractMetadata?.description}</p>
            <p>Price: 100$</p>
          </div>
          {clientSecret && (
            <Elements options={options} stripe={stripe}>
              <Form />
            </Elements>
          )}
        </>
      ) : (
        <ConnectWallet />
      )}
    </div>
  );
}
