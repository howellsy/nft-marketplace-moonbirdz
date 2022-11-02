import { useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { nftAddress, marketAddress } from '../config';
import { INFURA_CLIENT_HOST, INFURA_GATEWAY_URL, INFURA_PROJECT_ID, INFURA_PROJECT_SECRET } from '../constants';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import MBMarket from '../artifacts/contracts/MBMarket.sol/MBMarket.json';

const auth = 'Basic ' + btoa(INFURA_PROJECT_ID + ":" + INFURA_PROJECT_SECRET);

// set up IPFS to host our NFT data
const client = ipfsHttpClient({
  host: INFURA_CLIENT_HOST,
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

const MintItem = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    description: '',
    name: '',
    price: '',
  });
  const router = useRouter();

  /**
   * Upload NFT images when they are updated in the form
   */
  const onChange = async (e) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(
        file, {
          progress: (prog) => console.log('🚨 received:', prog)
        }
      );
      const url = `${INFURA_GATEWAY_URL}${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log('🚨 error uploading file', error);
    }
  };

  const onClickMintNft = async () => {
    const { description, name, price } = formInput;
    if (!description || !name || !price || !fileUrl) {
      return;
    }

    const data = JSON.stringify({ description, name, image: fileUrl });
    try {
      const added = await client.add(data);
      const url = `${INFURA_GATEWAY_URL}${added.path}`;
      createMarketItem(url);
    } catch (error) {
      console.log('🚨 error creating sale', error);
    }
  };

  /**
   * Create the item and list it on the marketplace
   */
  const createMarketItem = async (url) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    // create the NFT
    let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    let transaction = await contract.mintToken(url);

    const tx = await transaction.wait();
    const event = tx.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, 'ether');

    // list the item for sale on the marketplace
    contract = new ethers.Contract(marketAddress, MBMarket.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    transaction = await contract.makeMarketItem(nftAddress, tokenId, price, { value: listingPrice });
    await transaction.wait();

    router.push('./');
  };

  return (
    <div className='flex flex-col p-4 items-center'>
      <h1 className='font-bold text-lg'>Mint tokens and list them for sale in the marketplace</h1>
      <div className='w-1/2 flex flex-col'>
        <input 
          name='asset-name'
          placeholder='Asset name'
          className='mt-8 border rounded p-4'
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <input 
          name='asset-description'
          placeholder='Asset description'
          className='mt-2 border rounded p-4'
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input 
          name='asset-price'
          placeholder='Asset price in ETH'
          className='mt-2 border rounded p-4'
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input 
          type='file'
          name='asset-file'
          className='mt-4'
          onChange={onChange}
        />
        {fileUrl && (
          <img className='rounded mt-4' width='350px' src={fileUrl} alt='NFT file preview' />
        )}

        <button 
          className='font-bold mt-4 text-white rounded p-4'
          style={{ background: '#03045E'}}
          onClick={onClickMintNft}>
            Mint NFT
        </button>
      </div>
    </div>
  );
};

export default MintItem;
