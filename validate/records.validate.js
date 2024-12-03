const Joi=require('joi');
const joiObjectId=require('joi-objectid')(Joi);

const validateRecords=(req,res,next)=>{
    const schema=Joi.object({
        doctorId:joiObjectId().required(),
        appointmentId:joiObjectId().required(),
        diagnosis:Joi.string().required(),
        comments:Joi.string().required(),
        prescription:Joi.object({
            syrup:Joi.object({
                name:Joi.string().required(),
                doseSchedule:Joi.array().items(Joi.string().valid('FN','AN')).required()
            }).required(),
            tablet:Joi.object({
                name:Joi.string().required(),
                doseSchedule:Joi.array().items(Joi.string().valid('FN','AN')).required()
            }).required(),
            injection:Joi.object({
                name:Joi.string().required(),
                doseSchedule:Joi.array().items(Joi.string().valid('FN','AN')).required()
            }).required()
        }).required()
    });
    const validate=schema.validate(req.body,{abortEarly:false});
    if(validate.error)
    {
        return res.status(400).send(validate.error.details.map(detail=>detail.message).join('\n'));
    }
    next();
}

exports.validateRecords=validateRecords;