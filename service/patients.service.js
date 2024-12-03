const {getConnection}=require('../startup/db');
const {ObjectId}=require('mongodb');
const bcrypt=require('bcrypt');
const createUserService=require('../service/createUser.service');

const savePatientInfo=async(req,res)=>{
    const db=await getConnection();
    const patients = db.collection('patients');
    const existingUser=await db.collection('user').findOne({email:req.body.email});
    if(existingUser)
    {
        return res.status(400).send('User already registered');
    }
    const response=await createUserService.createUser(req,'Patient');
    const result = await patients.insertOne({
        userId:response.insertedId,
        name: req.body.name,
        email: req.body.email,
        dob: new Date(req.body.dob),
        contact: req.body.contact,
        address: req.body.address,
        createdOn: new Date()
    });
    res.status(201).send({
        status: 'successful',
        _id: result.insertedId,
        userId:response.insertedId
    });
};
const getPatientInfo=async(req,res)=>{
    const db=await getConnection();
    const result = await db.collection('patients').find().toArray();
    res.status(200).send(result);
}
const getPatientInfoById=async(req,res)=>{
    const db=await getConnection();
    if(!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Invalid patient ID.");
    }
    const result = await db.collection('patients').findOne({ _id: new ObjectId(req.params.id) });
    if(!result)
    {
        return res.status(404).send("Patient with the given ID not found.");   
    }
    res.status(200).send(result);
}
const updatePatientInfo=async(req,res)=>{
    const db=await getConnection();
    const patients = db.collection('patients');
    if(!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Invalid patient ID.");
    }
    const user = await patients.findOne({ _id: new ObjectId(req.params.id) });
    if(user.email!=req.body.email)
    {
        const existingUser=await db.collection('user').findOne({email:req.body.email});
        if(existingUser)
        {
            return res.status(400).send('User already registered');
        }
    }
    const updateFields={};
    if(req.body.name) updateFields.name=req.body.name;
    if(req.body.dob) updateFields.dob=new Date(req.body.dob);
    if(req.body.email) updateFields.email=req.body.email;
    if(req.body.contact) updateFields.contact=req.body.contact;
    if(req.body.address) updateFields.address=req.body.address;
    const result = await patients.updateOne(
        {_id:new ObjectId(req.params.id) },
        {$set:updateFields}
    );
    const updateUserFields={};
    if(req.body.name) updateUserFields.name=req.body.name;
    if(req.body.email) updateUserFields.email=req.body.email;
    if(req.body.contact) updateUserFields.contact=req.body.contact;
    if(req.body.password){
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(req.body.password,salt);
        updateUserFields.password=hashedPassword;
    }
    const userUpdate=await db.collection('user').updateOne(
        {_id:new ObjectId(user.userId)},
        {$set:updateUserFields}
    )
    if (result.matchedCount === 0) {
        return res.status(404).send("Patient with the given ID not found.");
    }
    if (userUpdate.matchedCount === 0) {
        return res.status(404).send("userId for the Patient not found.");
    }
    res.status(201).send({status:'successful'});
}

module.exports={
    savePatientInfo,
    getPatientInfo,
    getPatientInfoById,
    updatePatientInfo
};