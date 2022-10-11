const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MBMarket", function () {
  const setUpMarketContract = async () => {
    const Market = await ethers.getContractFactory('MBMarket');
    marketContract = await Market.deploy();
    await marketContract.deployed();

    return {
      marketContract,
    }
  };

  const setUpNftContract = async (marketContract) => {
    const NFT = await ethers.getContractFactory('NFT');
    const nftContract = await NFT.deploy(marketContract.address);
    await nftContract.deployed();

    return {
      nftContract
    };
  };

  const mintTestNfts = async (marketContract, nftContract, numNftsToMint) => {
    const nftContractAddress = nftContract.address;
    const auctionPrice = ethers.utils.parseUnits('100', 'ether');

    for (let i = 1; i <= numNftsToMint; i++) {
      await nftContract.mintToken(`https-t${i}`);

      const listingPrice = await marketContract.getListingPrice();
      await marketContract.makeMarketItem(nftContractAddress, i, auctionPrice, { value: listingPrice });
    }
  };

  it("Should deploy a market contract", async () => {
    const { marketContract } = await setUpMarketContract();
    expect(marketContract.address).to.be.a('string');
  });

  it("Should get the listing price", async () => {
    const { marketContract } = await setUpMarketContract();
    const listingPrice = await marketContract.getListingPrice();

    const formattedPrice = ethers.utils.formatEther(listingPrice);
    expect(formattedPrice).to.equal('0.045');
  });

  it("Can get the array of NFTs minted", async () => {
    const { marketContract } = await setUpMarketContract();
    const { nftContract } = await setUpNftContract(marketContract);
    const numNftsToMint = 2;
    
    await mintTestNfts(marketContract, nftContract, numNftsToMint);

    const itemsCreated = await marketContract.fetchItemsCreated();
    const unsoldNfts = await marketContract.fetchMarketTokens();

    expect(itemsCreated).to.be.length(2);
    expect(unsoldNfts).to.be.length(2);
  });

  it("Can create a market sale", async () => {
    const { marketContract } = await setUpMarketContract();
    const { nftContract } = await setUpNftContract(marketContract);
    const numNftsToMint = 2;
    
    await mintTestNfts(marketContract, nftContract, numNftsToMint);

    const [_, buyerAddress] = await ethers.getSigners();
    const auctionPrice = ethers.utils.parseUnits('100', 'ether');
    await marketContract.connect(buyerAddress).createMarketSale(nftContract.address, 1, {
      value: auctionPrice
    });

    const unsoldNfts = await marketContract.fetchMarketTokens();
    expect(unsoldNfts).to.be.length(1);
  });
});
