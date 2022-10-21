import { from } from 'env-var';

const env = from({
  NEXT_PUBLIC_INFURA_CLIENT_HOST: process.env.NEXT_PUBLIC_INFURA_CLIENT_HOST,
  NEXT_PUBLIC_INFURA_GATEWAY_URL: process.env.NEXT_PUBLIC_INFURA_GATEWAY_URL,
  NEXT_PUBLIC_INFURA_PROJECT_ID: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
  NEXT_PUBLIC_INFURA_PROJECT_SECRET: process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET,
});

export const INFURA_CLIENT_HOST = env.get('NEXT_PUBLIC_INFURA_CLIENT_HOST').required().asString();

export const INFURA_GATEWAY_URL = env.get('NEXT_PUBLIC_INFURA_GATEWAY_URL').required().asUrlString();

export const INFURA_PROJECT_ID = env.get('NEXT_PUBLIC_INFURA_PROJECT_ID').required().asString();

export const INFURA_PROJECT_SECRET = env.get('NEXT_PUBLIC_INFURA_PROJECT_SECRET').required().asString();
