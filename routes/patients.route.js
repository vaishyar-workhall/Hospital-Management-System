const express=require('express');
const router=express.Router();
const patientsService=require('../service/patients.service');
const patientValidate=require('../validate/patient.validate');
const appointmentService=require('../service/appointments.service');
const recordService=require('../service/records.service');
const recordValidate=require('../validate/records.validate');
const {auth}=require('../middleware/auth');
const {admin}=require('../middleware/admin');
const {recordAccess}=require('../middleware/recordAccess');
const { verifyUser } = require('../middleware/verifyUser');

router.post('/',
    patientValidate.validatePatients,
    patientsService.savePatientInfo
);
router.post('/:id/records',auth,recordAccess,
    recordValidate.validateRecords,
    recordService.saveRecordsInfo
);
router.get('/',auth,admin,
    patientsService.getPatientInfo
);
router.get('/:id',auth,verifyUser,
    patientsService.getPatientInfoById
);
router.get('/:id/appointments',auth,verifyUser,
    appointmentService.getPatientAppointment
);
router.get('/:id/records',auth,verifyUser,
    recordService.getPatientRecords
);
router.put('/:id',auth,verifyUser,
    patientValidate.validateUpdatePatients,
    patientsService.updatePatientInfo
);
module.exports=router;