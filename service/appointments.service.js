const {getConnection}=require('../startup/db');
const {ObjectId}=require('mongodb');
const {existingDoctorAppointments,existingPatientAppointments}=require('./checkExistingAppointments');

const saveAppointmentInfo=async(req,res)=>{
    const db=await getConnection();
    const appointments=db.collection('appointments');
    const startTime=new Date(req.body.appointmentStartTime);
    const endTime=new Date(req.body.appointmentEndTime);
    const doctorAppointments = await existingDoctorAppointments(db,req.body.doctorId,startTime,endTime);
    console.log(doctorAppointments);
    if(doctorAppointments.length>0)
    {
        return res.status(400).send("The Doctor has another appointment at this time");
    }
    const patientAppointments = await existingPatientAppointments(db,req.body.patientId,startTime,endTime);
    if(patientAppointments.length>0)
    {
        return res.status(400).send("The patient has booked another appointment at this time");
    }
    const result=await appointments.insertOne({
        doctorId:new ObjectId(req.body.doctorId),
        patientId:new ObjectId(req.body.patientId),
        appointmentStartTime:startTime,
        appointmentEndTime:endTime,
        reason: req.body.reason,
        createdOn: new Date(),
        status:'Pending'
    });
    res.status(201).send({
        status: 'successful',
        _id: result.insertedId
    });
};

const getAppointmentInfoById=async(req,res)=>{
    const db=await getConnection();
    if(!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Invalid appointment ID.");
    }
    const result = await db.collection('appointments').findOne({ _id: new ObjectId(req.params.id) });
    if(!result)
    {
        return res.status(404).send("appointment with the given ID not found.");   
    }
    res.status(200).send(result);
}

const getPatientAppointment=async(req,res)=>{
    const db=await getConnection();
    if(!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Invalid patient ID.");
    }
    let query={ patientId: new ObjectId(req.params.id)};
    if(req.query.status)
    {
        query.status=req.query.status;
    }
    const result = await db.collection('appointments').find(query).toArray();
    res.status(200).send(result);
}

const getDoctorAppointment=async(req,res)=>{
    const db=await getConnection();
    if(!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Invalid doctor ID.");
    }
    let query={doctorId: new ObjectId(req.params.id)};
    if(req.query.status)
    {
        query.status=req.query.status;
    }
    const result = await db.collection('appointments').find(query).toArray();
    res.status(200).send(result);
}

const updateAppointmentInfo=async(req,res)=>{
    const db=await getConnection();
    const appointments = db.collection('appointments');
    if(!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Invalid appointment ID.");
    }
    const entry=await appointments.findOne({ _id: new ObjectId(req.params.id)});
    if(entry.status==="Completed" || entry.status==="Cancelled")
    {
        return res.status(400).send(`This appointment was already ${entry.status}`);
    }
    const startTime=new Date(req.body.appointmentStartTime || entry.appointmentStartTime); 
    const endTime=new Date(req.body.appointmentEndTime || entry.appointmentEndTime);
    const doctorAppointments = await existingDoctorAppointments(db,req.body.doctorId,startTime,endTime);
    if(doctorAppointments.length>0 && doctorAppointments[0]._id!=req.params.id)
    {
        return res.status(400).send("The Doctor has another appointment at this time");
    }
    const patientAppointments = await existingPatientAppointments(db,req.body.patientId,startTime,endTime);
    if(patientAppointments.length>0 && patientAppointments[0]._id!=req.params.id)
    {
        return res.status(400).send("The patient has booked another appointment at this time");
    }

    const updateFields={};
    if(req.body.doctorId) updateFields.doctorId=new ObjectId(req.body.doctorId);
    if(req.body.patientId) updateFields.patientId=new ObjectId(req.body.patientId);
    if(req.body.appointmentStartTime) updateFields.appointmentStartTime=req.body.appointmentStartTime;
    if(req.body.appointmentEndTime) updateFields.appointmentEndTime=req.body.appointmentEndTime;
    if(req.body.reason) updateFields.reason=req.body.reason;
    
    const result = await appointments.updateOne(
        {_id:new ObjectId(req.params.id) },
        {$set:updateFields}
    );
    if (result.matchedCount === 0) {
        return res.status(404).send("Appointment with the given ID not found.");
    }
    res.status(201).send({
        status: 'successful',
        _id: req.params.id
    });
}

const cancelAppointment=async(req,res)=>{
    const db=await getConnection();
    const appointments = db.collection('appointments');
    if(!ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Invalid appointment ID.");
    }
    const entry=await appointments.findOne({ _id: new ObjectId(req.params.id)});
    if(entry.status==="Completed" || entry.status==="Cancelled")
    {
        return res.status(400).send(`This appointment was already ${entry.status}`);
    }
    const result = await appointments.updateOne(
        {_id:new ObjectId(req.params.id) },
        {$set:{status:'Cancelled'}}
    );
    if (result.matchedCount===0) {
        return res.status(404).send("Appointment with the given ID not found.");
    }
    res.status(200).send({
        status: 'successful',
        _id: req.params.id
    });
}

module.exports={
    saveAppointmentInfo,
    getPatientAppointment,
    getDoctorAppointment,
    getAppointmentInfoById,
    updateAppointmentInfo,
    cancelAppointment
};