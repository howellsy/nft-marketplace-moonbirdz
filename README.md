# Moonbirdz NFT Marketplace

## Smart Contracts

This app uses 2 smart contracts:

- `MBMarket.sol` - fetching NFTs, keeping track of sold/unsold NFTs, creating sales (buying transactions)
- `NFT.sol` - for storing URIs and minting tokens

## How to Deploy the Smart Contracts Locally

Start a local Hardhat node with:

```
yarn start:hardhat
```

Deploy the 2 smart contracts to the local node with:

```
yarn deploy:hardhat
```

> This command will also write the contract addresses to a file at `./config.js` where they can be consumed by the app.
