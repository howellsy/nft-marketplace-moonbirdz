// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

// inherit ERC721URIStorage
contract NFT is ERC721URIStorage {
  // counters to keep track of tokenIds
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  // address of marketplace for NFTs to interact
  address contractAddress;

  constructor(address marketplaceAddress) ERC721('MoonBirdz', 'MBIRDZ') {
    contractAddress = marketplaceAddress;
  }

  // mint the token, set it for sale and return the ID
  function mintToken(string memory tokenURI) public returns(uint) {
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();

    _mint(msg.sender, newItemId);
    _setTokenURI(newItemId, tokenURI);

    // give the marketplace the approval to transact between users
    setApprovalForAll(contractAddress, true);

    return newItemId;
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
      if (idToMarketToken[i + 1].owner = msg.sender) {
        uint currentId = idToMarketToken[i + 1].itemId;
        MarketToken storage currentItem = idToMarketToken[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }

    return items;
  }
}
