import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { nftAddress, marketAddress } from '../config';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import MBMarket from '../artifacts/contracts/MBMarket.sol/MBMarket.json';
import { getFormattedNFTs, getWeb3Provider } from '../utils';

const Home = () => {
  const [NFTs, setNFTs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadNFTs = async() => {
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(marketAddress, MBMarket.abi, provider);

    const data = await marketContract.fetchMarketTokens();

    const items = await getFormattedNFTs(data, tokenContract);

    setNFTs(items);
    setIsLoaded(true);
  };

  const buyNFT = async (nft) => {
    const provider = await getWeb3Provider();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(marketAddress, MBMarket.abi, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await contract.createMarketSale(
      nftAddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();
    loadNFTs();
  };

  useEffect(() => {
    loadNFTs();
  }, []);

  if (isLoaded && !NFTs.length) {
    return (
      <h1 className='px-20 py-7 text-4x1'>No NFTs in marketplace</h1>
    );
  }

  return (
    <div className='flex justify-center'>
      <div className='px-4' style={{ maxWidth: '1600px'}}>
        <div className='grid grid-cols1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
          {
            NFTs.map((nft, i) => (
              <div key={i} className='border shadow rounded-x1 overflow-hidden'>
                <img src={nft.image} alt={nft.name} />
                <div className='p-4'>
                  <p style={{ height: '64px' }} className='text-3x1 font-semibold'>
                    {nft.name}
                  </p>
                  <div style={{ height: '72px' }} className='overflow-hidden'>
                      <p className='text-gray-400'>{nft.description}</p>
                  </div>
                </div>
                <div className='p-4 bg-black'>
                  <p className='text-3x-1 mb-4 font-bold text-white'>{nft.price} ETH</p>
                  <button 
                    className='w-full bg-purple-500 text-white font-bold py-3 px-12 rounded' 
                    onClick={() => buyNFT(nft)}>
                      Buy
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
};

export default Home;
