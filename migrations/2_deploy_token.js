const MyToken = artifacts.require('MyToken');
const Staking = artifacts.require('Staking');

module.exports = async function (deployer) {
  // deploying token
  const _name = 'MyToken';
  const _symbol = 'MTK';
  const totalsupply = 1000000;
  await deployer.deploy(MyToken, _name, _symbol, totalsupply);
  const myToken = await MyToken.deployed();

  // deploying staking smartcontract
  await deployer.deploy(Staking, myToken.address);
  const staking = await Staking.deployed();

  // transfering 50% of the token to staking smart contract
  await myToken.transfer(staking.address, '500000');
};
