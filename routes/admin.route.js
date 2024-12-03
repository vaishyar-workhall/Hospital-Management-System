const express=require('express');
const router=express.Router();
const reportService=require('../service/admin.service');
const {auth}=require('../middleware/auth');
const {admin}=require('../middleware/admin');

router.get('/patients/report',auth,admin,
    reportService.getPatientReport
);

router.get('/appointments/report',auth,admin,
    reportService.getAppointmentReport
);

router.get('/doctors/report',auth,admin,
    reportService.getDoctorReport
);

router.get('/records/report',auth,admin,
    reportService.getRecordsReport
);

module.exports=router;