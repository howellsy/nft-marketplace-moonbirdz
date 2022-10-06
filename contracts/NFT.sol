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


}
