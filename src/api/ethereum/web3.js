import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';

const provider = new HDWalletProvider(
  process.env.ADMIN_PHRASE,
  process.env.ROPSTEN
);

const web3 = new Web3(provider);

module.exports = web3;
