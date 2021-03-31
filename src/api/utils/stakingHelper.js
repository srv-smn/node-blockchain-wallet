import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import Staking from '../../abis/Staking.json';
import MyToken from '../../abis/MyToken.json';
import Transaction from '../models/transaction';
import {
  stakeTokenMail,
  unstakeTokenMail,
  claimBonusMail,
} from '../emails/mail';

const stakeToken = async (sender, amount) => {
  try {
    console.log(5);
    const provider = new HDWalletProvider(sender.phrase, process.env.ROPSTEN);
    console.log(6);
    const web3 = new Web3(provider);
    console.log(7);
    const stakingContract = new web3.eth.Contract(
      Staking.abi,
      Staking.networks[3].address
    );
    const token = new web3.eth.Contract(
      MyToken.abi,
      MyToken.networks[3].address
    );

    console.log(8);
    const senderAcc = sender.account;
    console.log(senderAcc);
    console.log(amount);

    console.log(9);

    const logg = await stakingContract.methods.mtk().call();
    console.log(logg);
    await token.methods
      .approve(Staking.networks[3].address, amount)
      .send({ gas: '1000000', from: senderAcc });
    console.log('approved');

    const transaction = await stakingContract.methods
      .stakeTokens(amount)
      .send({ gas: '1000000', from: senderAcc });

    console.log(10);

    const tr = new Transaction({
      sender: sender.email,
      receiver: 'TokenStaked@blockchain.com',
      amount: web3.utils.fromWei(amount, 'ether'),
      senderAddress: senderAcc,
      receiverAddress: 'Token is Staked',
      transactionHash: transaction.transactionHash,
    });
    console.log(11);
    await tr.save();
    const sendersBalanceStandart = await web3.utils.fromWei(amount, 'ether');
    stakeTokenMail(sender, sendersBalanceStandart, sender.name);
    console.log(12);
  } catch (error) {
    console.log(13);
    console.log(error);
    throw error;
  }
};

const unstakeToken = async (sender) => {
  try {
    console.log(5);
    const provider = new HDWalletProvider(sender.phrase, process.env.ROPSTEN);
    console.log(6);
    const web3 = new Web3(provider);
    console.log(7);
    const stakingContract = new web3.eth.Contract(
      Staking.abi,
      Staking.networks[3].address
    );
    console.log(8);
    const senderAcc = sender.account;
    console.log(senderAcc);
    console.log(9);
    const amount = await stakingContract.methods
      .stakingBalance(senderAcc)
      .call();

    const transaction = await stakingContract.methods
      .unstakeTokens()
      .send({ gas: '1000000', from: senderAcc });

    console.log(10);

    const tr = new Transaction({
      sender: 'TokenUnstaked@blockchain.com',
      receiver: sender.email,
      amount: web3.utils.fromWei(amount, 'ether'),
      senderAddress: 'Tokens Unstaked',
      receiverAddress: sender.email,
      transactionHash: transaction.transactionHash,
    });
    console.log(11);
    await tr.save();
    const sendersBalanceStandart = await web3.utils.fromWei(amount, 'ether');
    unstakeTokenMail(sender, sendersBalanceStandart, sender.name);
    console.log(12);
  } catch (error) {
    console.log(13);
    console.log(error);
    throw error;
  }
};

const claimReward = async (sender) => {
  try {
    console.log(5);
    const provider = new HDWalletProvider(sender.phrase, process.env.ROPSTEN);
    console.log(6);
    const web3 = new Web3(provider);
    console.log(7);
    const stakingContract = new web3.eth.Contract(
      Staking.abi,
      Staking.networks[3].address
    );
    console.log(8);
    const senderAcc = sender.account;
    console.log(senderAcc);
    console.log(9);
    const amount = await stakingContract.methods.calculateReward().call();

    const transaction = await stakingContract.methods
      .issueReward()
      .send({ gas: '1000000', from: senderAcc });

    console.log(10);

    const tr = new Transaction({
      sender: 'EarnedReward@blockchain.com',
      receiver: sender.email,
      amount: web3.utils.fromWei(amount, 'ether'),
      senderAddress: 'Earned Reward',
      receiverAddress: sender.email,
      transactionHash: transaction.transactionHash,
    });
    console.log(11);
    await tr.save();
    const sendersBalanceStandart = await web3.utils.fromWei(amount, 'ether');
    claimBonusMail(sender, sendersBalanceStandart, sender.name);
    console.log(12);
  } catch (error) {
    console.log(13);
    console.log(error);
    throw error;
  }
};

module.exports = { stakeToken, unstakeToken, claimReward };
