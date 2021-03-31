import web3 from './web3';
import Staking from '../../abis/Staking.json';

module.exports = new web3.eth.Contract(
  Staking.abi,
  Staking.networks[3].address
);
