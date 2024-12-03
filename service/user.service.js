const {getConnection}=require('../startup/db');
const bcrypt=require('bcrypt');
const {generateAuthToken}=require('../middleware/auth')

const saveUserInfo=async(req,res)=>{
    const db=await getConnection();
    const user=db.collection('user');
    let existingUser=await user.findOne({email:req.body.email});
    if(existingUser)
    {
        return res.status(400).send('User already registered');
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(req.body.password,salt);

    const result=await user.insertOne({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
        contact:req.body.contact,
        role:req.body.role
    });
    
    const token=generateAuthToken({ _id:result.insertedId,role: req.body.role });
    res.header('x-auth-token',token).send({
        status: 'successful',
        _id: result.insertedId
    });
}

exports.saveUserInfo=saveUserInfo;