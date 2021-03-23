import jwt from 'jsonwebtoken'
import User from '../models/user'

import logger from '../../../logger'
import responseHandler from './sendResponse'

const auth = async (req,res,next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,'welcome@')
        const user = await User.findOne({_id: decoded._id,'tokens.token':token})

        if(!user){
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next()
    } catch(e){
        //res.status(401).send({error: 'Please authenticate.'})
        responseHandler.sendError(res, 401,'Please authenticate.' ,`${e}`)
    }
}

module.exports = auth