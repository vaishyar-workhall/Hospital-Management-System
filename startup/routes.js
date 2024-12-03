const express=require('express');
const patients=require('../routes/patients.route');
const doctors=require('../routes/doctors.route');
const appointments=require('../routes/appointments.route');
const admin=require('../routes/admin.route');
const users=require('../routes/user.route');
const auth=require('../routes/auth.route');

module.exports=function(app){
    app.use(express.json());
    app.use('/api/patients',patients);
    app.use('/api/doctors',doctors);
    app.use('/api/appointments',appointments);
    app.use('/api/admin',admin);
    app.use('/api/users',users);
    app.use('/api/auth',auth);

    app.use((err, req, res, next) => {
        console.error(err.stack)
        res.status(500).send({err:'Something broke!',error:err.message})
      })
}