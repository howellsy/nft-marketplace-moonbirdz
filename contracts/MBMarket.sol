// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import 'hardhat/console.sol';

contract MBMarket is ReentrancyGuard {
  // counters to keep track of tokenIds
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIds;
  Counters.Counter private _tokensSold;

  // determine who is the owner of the contract and charge
  // a listing fee so the owner makes a commission
  address payable owner;

  uint256 listingPrice = 0.045 ether;

  constructor() {
    // set the owner
    owner = payable(msg.sender);
  } 

  // structs can act like objects
  struct MarketToken {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }

  mapping(uint256 => MarketToken) private idToMarketToken;

  // event to be emitted
  event MarketTokenMinted(
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

  function getListingPrice() public view returns (uint256) {
    return listingPrice;
  }

  // create market item to put up for sale
  function makeMarketItem(
    address nftContract,
    uint tokenId,
    uint price
  ) public payable nonReentrant {
    // nonReentrant is a modifier to prevent re-entry attack
    require(price > 0, 'Price must be at least 1 wei');
    require(msg.value == listingPrice, 'Price must be equal to listing price');

    _tokenIds.increment();
    uint itemId = _tokenIds.current();

    // put item up for sale (with no owner)
    idToMarketToken[itemId] = MarketToken(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false
    );

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit MarketTokenMinted(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false
    );
  }

  function createMarketSale(
    address nftContract,
    uint itemId
  ) public payable nonReentrant {
    uint price = idToMarketToken[itemId].price;
    uint tokenId = idToMarketToken[itemId].tokenId;
    require(msg.value == price, 'Please submit the asking price to continue');

    // transfer the amount to the seller
    idToMarketToken[itemId].seller.transfer(msg.value);

    // transfer the token to the buyer
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    
    idToMarketToken[itemId].owner = payable(msg.sender);
    idToMarketToken[itemId].sold = true;

    _tokensSold.increment();

    // transfer the listing price from the owner
    payable(owner).transfer(listingPrice);
  }

  // get the unsold NFTs
  function fetchMarketTokens() public view returns(MarketToken[] memory) {
    uint itemCount = _tokenIds.current();
    uint unsoldItemCount = _tokenIds.current() - _tokensSold.current();
    uint currentIndex = 0;
 
    MarketToken[] memory items = new MarketToken[](unsoldItemCount);

    // iterate over the items created
    for(uint i = 0; i < itemCount; i++) {
      // if token has not been sold, add it to the array
      if (idToMarketToken[i + 1].owner == address(0)) {
        uint currentId = i + 1;
        MarketToken storage currentItem = idToMarketToken[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

    // get the array of NFTs the user has purchased
  function fetchMyNFTs() public view returns (MarketToken[] memory) {
    uint totalItemCount = _tokenIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    // get the item count for the current user
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketToken[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketToken[] memory items = new MarketToken[](itemCount);

    // populate the return array with the user's items
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketToken[i + 1].owner == msg.sender) {
        uint currentId = idToMarketToken[i + 1].itemId;
        MarketToken storage currentItem = idToMarketToken[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }

    return items;
  }

  // get an array of NFTs minted by the seller
  function fetchItemsCreated() public view returns(MarketToken[] memory) {
    uint totalItemCount = _tokenIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    // get the item count for the seller who minted the NFTs
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketToken[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketToken[] memory items = new MarketToken[](itemCount);

    // populate the return array with the user's items
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketToken[i + 1].seller == msg.sender) {
        uint currentId = idToMarketToken[i + 1].itemId;
        MarketToken storage currentItem = idToMarketToken[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }

    return items;
  }
}
