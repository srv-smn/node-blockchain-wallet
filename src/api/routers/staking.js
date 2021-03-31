import express from 'express';
import web3 from '../ethereum/web3';
import staking from '../ethereum/staking';

import auth from '../middleware/auth';
import verify from '../middleware/verified';

import logger from '../../../logger';
import responseHandler from '../middleware/sendResponse';
import { stakeToken, unstakeToken, claimReward } from '../utils/stakingHelper';

const router = new express.Router();

router.get('/staking/staking-details', auth, verify, async (req, res) => {
  try {
    const balanceInWei = await staking.methods
      .stakingBalance(req.user.account)
      .call();
    const unix_timestamp = await staking.methods
      .timeStamp(req.user.account)
      .call();
    const balanceInEther = await web3.utils.fromWei(balanceInWei, 'ether');

    responseHandler.sendResponse(res, 200, 'Staking Details', {
      'Balance Staked': balanceInEther,
      'Staked At': unix_timestamp,
    });
  } catch (e) {
    logger.info(`${e}`);
    // res.status(400).send(e);
    responseHandler.sendError(res, 400, 'something went wrong', e);
  }
});

router.post('/staking/stake-token', auth, verify, async (req, res) => {
  try {
    const amount = web3.utils.toWei(req.body.amount, 'ether');
    await stakeToken(req.user, amount);
    responseHandler.sendResponse(res, 200, 'Token Staked Successfully', {
      amount: req.body.amount,
    });
  } catch (e) {
    logger.info(`${e}`);
    // res.status(400).send(e);
    responseHandler.sendError(res, 400, 'something went wrong', e);
  }
});

router.get('/staking/unstake-token', auth, verify, async (req, res) => {
  try {
    await unstakeToken(req.user);
    responseHandler.sendResponse(res, 200, 'Token Unstaked Successfully');
  } catch (e) {
    logger.info(`${e}`);
    // res.status(400).send(e);
    responseHandler.sendError(res, 400, 'something went wrong', e);
  }
});

router.get('/staking/claim-reward', auth, verify, async (req, res) => {
  try {
    await claimReward(req.user);
    responseHandler.sendResponse(res, 200, 'reward claimed Successfully');
  } catch (e) {
    logger.info(`${e}`);
    // res.status(400).send(e);
    responseHandler.sendError(res, 400, 'something went wrong', e);
  }
});

module.exports = router;
