const jwt=require('jsonwebtoken');
const config = require('config');

const generateAuthToken=(user)=>{
    const token=jwt.sign({_id:user._id,role:user.role},
    config.get('jwtPrivateKey'),{expiresIn:'1d'});
    return token;
}

const verifyAuth=(req,res,next)=>{
    const token=req.header('x-auth-token');
    if(!token)
    {
        return res.status(401).send('Acess denied. No token provided.')
    }
    try{
        const decoded=jwt.verify(token,config.get('jwtPrivateKey'));
        req.user=decoded;
        next();
    }
    catch(err){
        if(err.name==='TokenExpiredError'){
            res.status(400).send('Token has expired.');
        }
        else{
            res.status(400).send('Invalid token');
        }
    }
}

exports.generateAuthToken=generateAuthToken;
exports.auth=verifyAuth;