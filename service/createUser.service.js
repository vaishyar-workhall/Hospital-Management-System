const bcrypt=require('bcrypt');
const {getConnection}=require('../startup/db');

const createUser=async(req,role)=>{
    const db=await getConnection();
    const user=db.collection('user');
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash('Default@123',salt);

    const result=await user.insertOne({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
        contact:req.body.contact,
        role:role
    });
    return result;
}

exports.createUser=createUser;