const Joi=require('joi');
const joiObjectId=require('joi-objectid')(Joi);

const validateAppointments=(req,res,next)=>{
    const schema=Joi.object({
        doctorId:joiObjectId().required(),
        patientId:joiObjectId().required(),
        appointmentStartTime:Joi.date().min('now').required(),
        appointmentEndTime:Joi.date().min(Joi.ref('appointmentStartTime')).required(),
        reason:Joi.string().required()
    });
    const validate=schema.validate(req.body,{abortEarly:false});
    if(validate.error)
    {
        return res.status(400).send(validate.error.details.map(detail=>detail.message).join('\n'));
    }
    next();
}
const validateUpdateAppointments=(req,res,next)=>{
    const schema=Joi.object({
        doctorId:joiObjectId(),
        patientId:joiObjectId(),
        appointmentStartTime:Joi.date().min('now'),
        appointmentEndTime: Joi.date().min(Joi.ref('appointmentStartTime')), 
        reason:Joi.string()
    }).min(1);
    const validate=schema.validate(req.body,{abortEarly:false});
    if(validate.error)
    {
        return res.status(400).send(validate.error.details.map(detail=>detail.message).join('\n'));
    }
    next();
}

exports.validateAppointments = validateAppointments;
exports.validateUpdateAppointments = validateUpdateAppointments;