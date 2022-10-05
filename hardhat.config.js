require("@nomicfoundation/hardhat-toolbox");
const fs = require('fs');

const projectId = '918fef4e57164802a0124aa383417868';

// @TODO improve how private key is provided
const keyData = fs.readFileSync('./p-key.txt', {
  encoding: 'utf8',
  flag: 'r',
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337 // configuration standard
    },
    mumbai: {
      url: `https://mainnet.infura.io/v3/${projectId}`,
      accounts: [ keyData ],
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: [ keyData ],
    }
  },
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  },
};
