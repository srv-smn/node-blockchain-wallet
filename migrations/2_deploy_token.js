const MyToken = artifacts.require('MyToken');

module.exports = function (deployer) {
  const _name = 'MyToken';
  const _symbol = 'MTK';
  const totalsupply = 1000000;
  deployer.deploy(MyToken, _name, _symbol, totalsupply);
};
