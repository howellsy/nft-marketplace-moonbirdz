import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { nftAddress, marketAddress } from '../config';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import MBMarket from '../artifacts/contracts/MBMarket.sol/MBMarket.json';
import { getFormattedNFTs, getWeb3Provider } from '../utils';
import TokenItem from '../components/TokenItem';

const MyNfts = () => {
  const [NFTs, setNFTs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadNFTs = async() => {
    const provider = await getWeb3Provider();
    const signer = provider.getSigner();

    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(marketAddress, MBMarket.abi, signer);

    const data = await marketContract.fetchMyNFTs();

    const items = await getFormattedNFTs(data, tokenContract);

    setNFTs(items);
    setIsLoaded(true);
  };

  useEffect(() => {
    loadNFTs();
  }, []);

  if (isLoaded && !NFTs.length) {
    return (
      <h1 className='px-20 py-7 text-4x1'>You do not own any NFTs yet</h1>
    );
  }

  return (
    <div className='p-4'>
      <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>My NFTs</h1>
      <div className='px-4' style={{ maxWidth: '1600px'}}>
        <div className='grid grid-cols1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
          {
            NFTs.map((nft, i) => (
              <TokenItem token={nft} key={i} />
            ))
          }
        </div>
      </div>
    </div>
  )
};

export default MyNfts;
