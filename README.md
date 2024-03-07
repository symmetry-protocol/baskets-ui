# Symmetry User Interface

Welcome to the official GitHub repository for the Symmetry User Interface, a comprehensive project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). Dive into the on-chain asset management platform directly through [Symmetry](https://app.symmetry.fi/).

## Introduction to Symmetry

Symmetry is a pioneering on-chain asset management protocol designed to democratize the creation, management, and trading of tokenized baskets containing multiple cryptocurrencies. It facilitates the creation and automation of both mutable and immutable baskets, supporting compositions of up to 15 assets with varied weights. An example of its application includes the Solana DeFi Index—a curated basket featuring the top Solana DeFi tokens by market capitalization. The protocol ensures that rebalancing, restructuring, and management processes are streamlined, automated, and executed on-chain.

## Getting Started

Kickstart your development process by launching the server in a few simple steps:

```bash
npm install
```
```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
After starting the server, navigate to [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Configuring Platform Fees and Filtering Baskets

To tailor your platform to both filter baskets created through it and to accrue host platform fees, you'll need to modify a specific configuration. Here's how you can do it:

### Step 1: Locate the Configuration File

Navigate to the `src/redux` directory within your project's file structure.

### Step 2: Edit the Global State File

Open the `globalState.js` file located in this directory.

### Step 3: Set Your Host Public Key

Within `globalState.js`, find the `RPC_ENDPOINT` and `HOST_PUBKEY` variable. You will replace `RPC_ENDPOINT` with your RPC Provider endpoint and `HOST_PUBKEY` the public key address of your choice. This address will then act as the host platform, with fees being directed there.

```javascript
// Example modification in src/redux/globalState.js
export const HOST_PUBKEY = new PublicKey('YourPublicKeyHere'); // Replace "YourPublicKeyHere" with your actual public key address.
```

## About This Project

This project primarily utilizes Symmetry SDK, which is used to directly interact with Symmetry on-chain programs. 

The project uses Symmetry API primarily to fetch historical information about baskets, such as charts.

To learn more about using the SDK and the API, take a look at the following resources:

- [Symmetry SDK Documentation](https://docs.symmetry.fi/infrastructure/symmetry-sdks) - Learn how to interact with Symmetry Protocol on-chain programs.

- [Symmetry API Documentation](https://docs.symmetry.fi/infrastructure/symmetry-apis) - Learn how to interact with Symmetry Protocol without integrating external libraries, through a web API.

## Socials
[Twitter](https://twitter.com/symmetry_fi)
[Discord](https://discord.gg/ahdqBRgE7G)

In case you have any questions or issues, feel free to join our Discord, we're happy to help!