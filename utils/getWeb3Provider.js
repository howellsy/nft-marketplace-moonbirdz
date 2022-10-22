import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

/**
 * Creates a new Web3Modal provider and wraps it as an
 * ethers.js provider
 */
export const getWeb3Provider = async () => {
  const web3Modal = new Web3Modal();
  const provider = await web3Modal.connect();
  return new ethers.providers.Web3Provider(provider);
};
