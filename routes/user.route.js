const express=require('express');
const router=express.Router();
const userService=require('../service/user.service');
const userValidate=require('../validate/user.validate');
const patientUserValidate=require('../validate/user.patient.validate');
const patientUserService=require('../service/user.patient.service');
const {auth}=require('../middleware/auth');
const {admin}=require('../middleware/admin');

router.post('/',auth,admin,
    userValidate.validateUser,
    userService.saveUserInfo
);

router.post('/patients',
    patientUserValidate.validatePatientUser,
    patientUserService.savePatientUser
);

module.exports=router;