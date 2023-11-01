# Fiat NFT checkout with thirdweb Engine

This guide demonstrates using thirdweb Engine to sell NFTs with credit card.

1. Buyers pays with credit card.
1. Upon payment, your backend calls Engine.
1. Engine mints an NFT to the buyer's wallet.

The buyer receives the NFT without requiring wallet signatures or gas funds.

## Instructions

[**Read the full guide**](https://portal.thirdweb.com/guides/engine/fiat-nft-checkout).

1. Create a `.env.local` file from the template:
   ```bash
   cp .env.example .env.local
   ```
1. Provide details of your project.
   ```bash
   ENGINE_URL=https://...
   THIRDWEB_CLIENT_ID=0123...
   THIRDWEB_SECRET_KEY=AaBb...
   BACKEND_WALLET_ADDRESS=0x...
   NFT_CONTRACT_ADDRESS=0x...
   ```
1. Start the server with favorite package manager.
   ```bash
   bun dev
   ```

## Get in touch

- Support: [Join the Discord](https://discord.gg/thirdweb)
- Twitter: [@thirdweb](https://twitter.com/thirdweb)
