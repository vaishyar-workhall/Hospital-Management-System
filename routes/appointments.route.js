const express=require('express');
const router=express.Router();
const appointmentService=require('../service/appointments.service');
const appointmentValidate=require('../validate/appointment.validate');
const {auth}=require('../middleware/auth');

router.post('/',auth,
    appointmentValidate.validateAppointments,
    appointmentService.saveAppointmentInfo
);
router.get('/:id',auth,
    appointmentService.getAppointmentInfoById
);
router.put('/:id',auth,
    appointmentValidate.validateUpdateAppointments,
    appointmentService.updateAppointmentInfo
);
router.put('/:id/cancelAppointment',auth,
    appointmentService.cancelAppointment
);
module.exports=router;
