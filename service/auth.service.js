const {getConnection}=require('../startup/db');
const bcrypt=require('bcrypt');
const {generateAuthToken}=require('../middleware/auth')

const authUser=async(req,res)=>{
    const db=await getConnection();
    const user=db.collection('user');
    let User=await user.findOne({email:req.body.email});
    if(!User)
    {
        return res.status(400).send('Invalid email or password-email not found');
    }
    const isValid=await bcrypt.compare(req.body.password,User.password);
    if(!isValid)
    {
        return res.status(400).send('Invalid email or password');
    }

    const token=generateAuthToken(User);
    res.status(200).send(token);
}

exports.authUser=authUser;