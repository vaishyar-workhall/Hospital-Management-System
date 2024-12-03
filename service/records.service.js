const {getConnection}=require('../startup/db');
const { ObjectId } = require('mongodb');

const saveRecordsInfo=async(req,res)=>{
    const db=await getConnection();
    const records=db.collection('records');
    const result=await records.insertOne({
        patientId:new ObjectId(req.params.id),
        doctorId:new ObjectId(req.body.doctorId),
        appointmentId:new ObjectId(req.body.appointmentId),
        diagnosis:req.body.diagnosis,
        prescription:req.body.prescription,
        createdOn: new Date(),
        createdBy: new ObjectId(req.user._id)
    })
    db.collection('appointments').updateOne(
        {_id:new ObjectId(req.body.appointmentId)},
        {$set:{status:'Completed'}}
    );
    res.status(201).send({
        status:'successful',
        _id:result.insertedId
    });
}

const getPatientRecords=async(req,res)=>{
    const db=await getConnection();
    if(!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Invalid patient ID.");
    }
    const result=await db.collection('records').find({patientId:new ObjectId(req.params.id)}).toArray();
    res.status(200).send(result);
}

module.exports={
    saveRecordsInfo,
    getPatientRecords
}