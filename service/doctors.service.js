const {getConnection}=require('../startup/db');
const {ObjectId}=require('mongodb');
const bcrypt=require('bcrypt');
const createUserService=require('../service/createUser.service');

const savedoctorInfo=async(req,res)=>{
    const db=await getConnection();
    const doctors = db.collection('doctors');
    let existingUser=await db.collection('user').findOne({email:req.body.email});
    if(existingUser)
    {
        return res.status(400).send('User already registered');
    }
    const response=await createUserService.createUser(req,'Doctor');
    const result = await doctors.insertOne({
        userId:response.insertedId,
        name: req.body.name,
        email:req.body.email,
        specialization: req.body.specialization,
        contact: req.body.contact,
        availability: req.body.availability,
        role:"Doctor",
        createdOn: new Date()
    });
    res.status(201).send({
        status:'successful',
        _id: result.insertedId,
        userId:response.insertedId,
        name:result.name
    });
};

const getdoctorInfo=async(req,res)=>{
    const db=await getConnection();
    const result = await db.collection('doctors').find().toArray();
    res.status(200).send(result);
}

const getdoctorInfoById=async(req,res)=>{
    const db=await getConnection();
    if(!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Invalid doctor ID.");
    }
    const result = await db.collection('doctors').findOne({ _id: new ObjectId(req.params.id) });
    if(!result)
    {
        return res.status(404).send("doctor with the given ID not found.");   
    }
    res.status(200).send(result);
}

const updatedoctorInfo=async(req,res)=>{
    const db=await getConnection();
    const doctors = db.collection('doctors');
    if(!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Invalid doctor ID.");
    }
    const user = await doctors.findOne({ _id: new ObjectId(req.params.id) });
    if (!user) {
        return res.status(404).send("Doctor with the given ID not found.");
    }
    const findUser=await db.collection('user').findOne({_id:new ObjectId(user.userId)});
    if (!findUser) {
        return res.status(404).send("userId for the Doctor not found.");
    }
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
    if(req.body.email) updateFields.email=req.body.email;
    if(req.body.specialization) updateFields.specialization=req.body.specialization;
    if(req.body.contact) updateFields.contact=req.body.contact;
    if(req.body.availability) updateFields.availability=req.body.availability;
    
    const result = await doctors.updateOne(
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
    res.status(201).send({status:'successful'});
}

module.exports={
    savedoctorInfo,
    getdoctorInfo,
    getdoctorInfoById,
    updatedoctorInfo
};