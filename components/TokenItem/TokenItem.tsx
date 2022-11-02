import * as React from 'react';

export type NFT = {
  description: string;
  image: string;
  name: string;
  price: number;
};

export interface TokenItemProps {
  buttonText: string;
  onClickButton: () => void;
  token: NFT;
}

const TokenItem = ({ buttonText, onClickButton, token } : TokenItemProps) => {
  const { description, image, name, price } = token;

  return (
    <div className='border shadow rounded-x1 overflow-hidden'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={name} />
      <div className='p-4' style={{ background: '#CAF0F8 '}}>
        <p className='text-3x1 font-semibold' style={{ color: '#03045E' }}>
          {name}
        </p>
        <p className='py-2 overflow-hidden' style={{ color: '#0077B6', minHeight: '4rem' }}>{description}</p>
      </div>
      <div className='p-4 bg-black'>
        <p className='text-3x-1 mb-4 font-bold text-white'>{price} ETH</p>
        {buttonText && onClickButton && (
          <button 
            className='w-full bg-purple-500 text-white font-bold py-3 px-12 rounded' 
            onClick={onClickButton}>
              {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default TokenItem;
