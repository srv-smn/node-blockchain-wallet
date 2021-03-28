import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';

const getAddress = async (phrase) => {
  try {
    const provider = new HDWalletProvider(phrase, process.env.ROPSTEN);
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  } catch (error) {
    return error;
  }
};

module.exports = getAddress;
