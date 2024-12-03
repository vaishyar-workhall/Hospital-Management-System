const {ObjectId}=require('mongodb');

const existingDoctorAppointments=async(db,doctorId,startTime,endTime) => {
    return await db.collection('appointments').find({
        doctorId:new ObjectId(doctorId),
        appointmentStartTime:{$lt:endTime},
        appointmentEndTime:{$gt:startTime},
        status:{$ne:"Cancelled"}
    }).toArray();
};

const existingPatientAppointments = async(db,patientId,startTime,endTime) => {
    return await db.collection('appointments').find({
        patientId:new ObjectId(patientId),
        appointmentStartTime:{$lt:endTime},
        appointmentEndTime:{$gt:startTime},
        status:{$ne:"Cancelled"}
    }).toArray();
};

exports.existingPatientAppointments = existingPatientAppointments;
exports.existingDoctorAppointments = existingDoctorAppointments;
