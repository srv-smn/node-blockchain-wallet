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
import sendTransaction from '../utils/transactionHelper'
import { sendSignUpOtp, sendSignInOTP ,ReceivedTokenMail,sendTokenMail} from '../emails/mail'


// claim the signup bonus once your account is verified and mnemonic is provided
  router.post("/claim-bonus",auth,verify, async (req, res) => {
    try {
      
     const transaction = await signupBonus(req.user)
      res.status(201).send();
    } catch (e) {
      res.status(400).send(e);
    }
  });


// to see the availabe balance 

  router.get('/get-balance',auth, verify, async(req, res)=>{
    try {
      let balance = await token.methods.balanceOf(req.user.account).call()
      balance = await web3.utils.fromWei(balance, 'ether')
      res.send(balance);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
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
      res.status(201).send();

    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  })

// see a particular transaction Id  
  router.get('/transaction/:id',auth,async (req,res)=>{
    const _id = req.params.id
    try{
       //const task = await Transaction.findOne({_id,owner:req.user._id})
       const task = await Transaction.findOne({ $and:[{_id}, { $or:[{'sender':req.user.email}, {'receiver':req.user.email} ]} ]})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch(e){
        res.status(500).send()
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
         return res.status(404).send();
        }
        console.log(st.length);
        res.send(st);

      } else {
        // normal user will be able to see their own transaction
        const st = await Transaction.find( { $or:[{'sender':req.user.email}, {'receiver':req.user.email} ]})
      if(!st){
       return res.status(404).send();
      }
      console.log(st.length);
      res.send(st);
        
      }
      
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  })


  module.exports = router;