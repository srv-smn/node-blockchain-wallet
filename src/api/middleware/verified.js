import User from '../models/user'

const verify = async (req,res,next) =>{
    try{
        if(req.user.verified == false){
            return res.status(401).send({error: 'Please Verify your account'})
        }
        next()
    } catch(e){
        console.log(e);
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = verify