import '../styles/globals.css';
import '../styles/app.css';
import Head from 'next/head';
import Link from 'next/link';

const Marketplace = ({ Component, pageProps }) => {
  return (
    <div>
      <Head>
        <title>Moonbirdz Marketplace</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className='border-b p-6' style={{ background: '#03045E' }}>
        <p className='text-4x1 font-bold text-white'>Moonbirdz Marketplace</p>
        <div className='flex mt-4 justify-center'>
          <Link href='/'>
            <a className='mr-4'>
              Main Marketplace
            </a>
          </Link>
          <Link href='/mint-tokens'>
            <a className='mr-4'>
              Mint Tokens
            </a>
          </Link>
          <Link href='/my-nfts'>
            <a className='mr-4'>
              My NFTs
            </a>
          </Link>
          <Link href='/account-dashboard'>
            <a className='mr-4'>
              Account Dashboard
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
};

export default Marketplace;
