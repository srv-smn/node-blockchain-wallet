import web3 from'../ethereum/web3'
import token from'../ethereum/token'
import User from"../models/user"
import Transaction from '../models/transaction'

const signupBonus = async (user) =>{
    if(user.reward == true)
    {
        throw new Error('Reward Already Claimed')
    }
    try {
    const receiver = user.account 
    const sender = await web3.eth.getAccounts() // admin account
    const amount = '1000000000000000000'

    const transaction = await token.methods.transfer(
        receiver, amount 
    ).send({gas:'1000000' , from: sender[0]})
    user.reward = true
    await user.save();
    const tr = new Transaction({
        sender: 'admin@platform.com',
        receiver:user.email,
        amount: web3.utils.fromWei(amount, 'ether'),
        senderAddress:sender[0],
        receiverAddress:receiver,
        transactionHash:transaction.transactionHash  
    })

    await tr.save()
    
    return transaction
        
    } catch (error) {
        return error
    }
    
}

module.exports = signupBonus