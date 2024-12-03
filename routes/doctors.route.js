const express=require('express');
const router=express.Router();
const doctorsService=require('../service/doctors.service');
const doctorValidate=require('../validate/doctor.validate');
const appointmentService=require('../service/appointments.service');
const {auth}=require('../middleware/auth');
const {admin}=require('../middleware/admin');
const { verifyUser } = require('../middleware/verifyUser');

router.post('/',auth,admin,
    doctorValidate.validatedoctors,
    doctorsService.savedoctorInfo
);
router.get('/',auth,admin,
    doctorsService.getdoctorInfo
);
router.get('/:id',auth,verifyUser,
    doctorsService.getdoctorInfoById
);
router.get('/:id/appointments',auth,verifyUser,
    appointmentService.getDoctorAppointment
);
router.put('/:id',auth,verifyUser,
    doctorValidate.validateUpdatedoctors,
    doctorsService.updatedoctorInfo
);

module.exports=router;