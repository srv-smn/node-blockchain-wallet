import HDWalletProvider from 'truffle-hdwallet-provider'
import Web3  from 'web3'
import MyToken from '../../abis/MyToken.json'
import User from"../models/user"
import Transaction from '../models/transaction'



const sendTransaction = async (sender, receiver, amount) =>{
    await console.log(receiver);
    if(sender.verified == false)
    {
        console.log(3);
        throw new Error('Sender not Verified')
    }

    if(receiver.verified == false)
    {
        console.log(4);
        throw new Error('Receiver not verified')
    }

    try {
        console.log(5);
        const provider = new HDWalletProvider(
            sender.phrase,
             process.env.ROPSTEN
             );
         console.log(6);
         const web3 = new Web3(provider);
         console.log(7);
         const token = new web3.eth.Contract(MyToken.abi, MyToken.networks[3].address)
            console.log(8);
         const senderAcc = sender.account
         const receiverAcc = receiver.account
         console.log(senderAcc);
         console.log(receiverAcc);

         console.log(9);
     
         const transaction = await token.methods.transfer(
             receiverAcc, amount 
         ).send({gas:'1000000' , from: senderAcc})

         console.log(10);

         const tr = new Transaction({
            sender: sender.email,
            receiver:receiver.email,
            amount:web3.utils.fromWei(amount, 'ether'),
            senderAddress:senderAcc,
            receiverAddress:receiverAcc,
            transactionHash:transaction.transactionHash  
        })
        console.log(11);
        await tr.save()
        console.log(12);
        
    } catch (error) {
        console.log(13);
        console.log(error);
        throw error  
    }
}

module.exports = sendTransaction