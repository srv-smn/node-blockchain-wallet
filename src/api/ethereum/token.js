import web3 from './web3';
import MyToken from '../../abis/MyToken.json';

module.exports = new web3.eth.Contract(
  MyToken.abi,
  MyToken.networks[3].address
);
