const hre = require('hardhat');
const fs = require('fs');

async function main() {
  const NFTMarket = await hre.ethers.getContractFactory('MBMarket');
  const nftMarket = await NFTMarket.deploy();

  await nftMarket.deployed();

  console.log('✅ nftMarket contract deployed to:', nftMarket.address);

  const NFT = await hre.ethers.getContractFactory('NFT');
  const nft = await NFT.deploy(nftMarket.address);

  await nft.deployed();

  console.log('✅ NFT contract deployed to:', nft.address);

  // output addresses to config file for use by the app
  let config = `
    export const marketAddress = '${nftMarket.address}';
    export const nftAddress = '${nft.address}';
  `;
  fs.writeFileSync('config.js', config);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
