import express from "express"
const router = new express.Router();


import web3 from '../ethereum/web3'
import getAddress from '../utils/userHelper'
import token from '../ethereum/token'
import signupBonus from '../utils/signupBonus'
import auth from"../middleware/auth"
import verify from"../middleware/verified"
import Transaction from"../models/transaction"
import User from '../models/user'
import {sendTransaction,sendTransactionViaAddress} from '../utils/transactionHelper'
import { sendSignUpOtp, sendSignInOTP ,ReceivedTokenMail,sendTokenMail} from '../emails/mail'
import logger from '../../../logger'
import responseHandler from '../middleware/sendResponse'

// claim the signup bonus once your account is verified and mnemonic is provided
  router.post("/claim-bonus",auth,verify, async (req, res) => {
    try {
      
     const transaction = await signupBonus(req.user)
      //res.status(201).send();
      responseHandler.sendResponse(res, 200,'bonus claim successful')
    } catch (e) {
      logger.info(`${e}`)
     // res.status(400).send(e);
      responseHandler.sendError(res, 400,'something went wrong' ,e)
    }
  });


// to see the availabe balance 

  router.get('/get-balance',auth, verify, async(req, res)=>{
    try {
      let balance = await token.methods.balanceOf(req.user.account).call()
      balance = await web3.utils.fromWei(balance, 'ether')
     // res.send(balance);
     responseHandler.sendResponse(res, 200,'available balance', `${balance} MTK Token`)
    } catch (error) {
      logger.info(`${error}`)
      console.log(error);
     // res.status(400).send(error);
     responseHandler.sendError(res, 400,'something went wrong' ,e)
    }
  })

// to send token to other user
// amount shoud be in wei
  router.post('/me/send',auth, verify, async(req, res)=>{
    try {
      const receiverId = req.body.recipient
      const recipient = await User.findByEmail(receiverId)
      console.log(1);
      const amount =  web3.utils.toWei(req.body.amount, 'ether');
      console.log(2);
      await sendTransaction(req.user, recipient, amount)
      
      const sendersBalance = await token.methods.balanceOf(req.user.account).call()
      const sendersBalanceStandart = await web3.utils.fromWei(sendersBalance, 'ether')

      const receiverBalance = await token.methods.balanceOf(recipient.account).call()
      const receiverBalanceStandart = await web3.utils.fromWei(receiverBalance, 'ether')

      const balance = await web3.utils.fromWei(amount, 'ether')

      ReceivedTokenMail(req.user.email,recipient.email,req.user.account,recipient.account ,balance,receiverBalanceStandart,recipient.name)
      sendTokenMail(req.user.email,recipient.email,req.user.account,recipient.account ,balance,sendersBalanceStandart,req.user.name)
     // res.status(201).send();
     responseHandler.sendResponse(res, 200,'Token transfer successful')

    } catch (error) {
      logger.info(`${error}`)
      console.log(error);
     // res.status(400).send(error);
     responseHandler.sendError(res, 400,'something went wrong' ,`${error}`)
    }
  })

  // send token to user from address
  router.post('/me/send/address',auth, verify, async(req, res)=>{
    try {
      const receiverId = req.body.recipient
      //const recipient = await User.findByEmail(receiverId)
      console.log(1);
      const amount =  web3.utils.toWei(req.body.amount, 'ether');
      console.log(2);
      await sendTransactionViaAddress(req.user, receiverId, amount)
      
      const sendersBalance = await token.methods.balanceOf(req.user.account).call()
      const sendersBalanceStandart = await web3.utils.fromWei(sendersBalance, 'ether')

      const balance = await web3.utils.fromWei(amount, 'ether')

      // ReceivedTokenMail(req.user.email,recipient.email,req.user.account,recipient.account ,balance,receiverBalanceStandart,recipient.name)
      sendTokenMail(req.user.email,'outside wallet user',req.user.account,receiverId ,balance,sendersBalanceStandart,req.user.name)
     // res.status(201).send();
     responseHandler.sendResponse(res, 200,'Token transfer successful')

    } catch (error) {
      logger.info(`${error}`)
      console.log(error);
     // res.status(400).send(error);
      responseHandler.sendError(res, 400,'something went wrong' ,`${error}`)
    }
  }) 



// see a particular transaction Id  
  router.get('/transaction/:id',auth,async (req,res)=>{
    const _id = req.params.id
    try{
       //const task = await Transaction.findOne({_id,owner:req.user._id})
       const task = await Transaction.findOne({ $and:[{_id}, { $or:[{'sender':req.user.email}, {'receiver':req.user.email} ]} ]})
        if(!task){
            return responseHandler.sendResponse(res, 404,'Transaction not found')
            //res.status(404).send()
        }
       // res.send(task)
       responseHandler.sendResponse(res, 200,'Transaction',task)
    } catch(e){
      logger.info(`${e}`)
        //res.status(500).send()
        responseHandler.sendError(res, 500,'Internal server error' ,`${e}`)
    }
})

// see all the transaction of the account 
// user can see their transactions
// admin can see all transaction
  router.get('/transactions',auth, verify, async(req, res)=>{

    try { // admin will be able to see all transaction
      if(req.user.admin){
        const st = await Transaction.find( { })
        if(!st){
         return responseHandler.sendResponse(res, 404,'Transaction not found')
         //res.status(404).send();
        }
        console.log(st.length);
        responseHandler.sendResponse(res, 200,'Transactions',st)
       // res.send(st);

      } else {
        // normal user will be able to see their own transaction
        const st = await Transaction.find( { $or:[{'sender':req.user.email}, {'receiver':req.user.email} ]})
      if(!st){
       return responseHandler.sendResponse(res, 404,'Transaction not found')
       //res.status(404).send();
      }
      console.log(st.length);
      return responseHandler.sendResponse(res, 200,'Transactions',st)
     // res.send(st);
        
      }
      
    } catch (error) {
      logger.info(`${error}`)
      console.log(error);
      return responseHandler.sendError(res, 400,'something went wrong',`${error}`)
      //res.status(400).send(error);
    }
  })


  module.exports = router;