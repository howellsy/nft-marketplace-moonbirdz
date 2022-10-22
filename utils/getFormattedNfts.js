import { ethers } from 'ethers';
import axios from 'axios';

/**
 * Formats array of raw NFT data for presentation
 */
export const getFormattedNFTs = async (data, tokenContract) => {
  return await Promise.all(data.map(async (i) => {
    const tokenUri = await tokenContract.tokenURI(i.tokenId);
    const meta = await axios.get(tokenUri);

    let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
    let item = {
      price,
      tokenId: i.tokenId.toNumber(),
      seller: i.seller,
      owner: i.owner,
      image: meta.data.image,
      name: meta.data.name,
      description: meta.data.description,        
    };
    return item;
  }));
};
