import User from '../models/user'
import logger from '../../../logger'
import responseHandler from './sendResponse'

const verify = async (req,res,next) =>{
    try{
        if(req.user.verified == false){
            return responseHandler.sendResponse(res, 401,'Please Verify your account')
            //res.status(401).send({error: 'Please Verify your account'})
        }
        next()
    } catch(e){
        console.log(e);
        logger.info(`${e}`)
        responseHandler.sendError(res, 401,'Please authenticate', `${e}`)
       // res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = verify