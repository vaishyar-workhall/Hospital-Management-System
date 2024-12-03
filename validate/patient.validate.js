const Joi=require('joi');
const validatePatients=(req,res,next)=>
{
    const schema=Joi.object({
        name:Joi.string().min(3).max(255).required(),
        dob:Joi.date().max('now').required(),
        contact:Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        email:Joi.string().email().required(),
        address:Joi.object({
            street:Joi.string().required(),
            city:Joi.string().valid('Coimbatore', 'Chennai', 'Others').required(),
            pincode:Joi.string().length(6).pattern(/^[0-9]+$/).required(),
        }).required()
    });
    const validate=schema.validate(req.body,{abortEarly:false});
    if(validate.error)
    {
        return res.status(400).send(validate.error.details.map(detail=>detail.message).join('\n'));
    }
    next();
}
const validateUpdatePatients=(req,res,next)=>
{
    const schema=Joi.object({
        name:Joi.string().min(3).max(255),
        dob:Joi.date().max('now'),
        contact:Joi.string().length(10).pattern(/^[0-9]+$/),
        email:Joi.string().email(),
        password:Joi.string().min(8),
        address:Joi.object({
            street:Joi.string(),
            city:Joi.string().valid('Coimbatore', 'Chennai', 'Others'),
            pincode:Joi.string().length(6).pattern(/^[0-9]+$/),
        })
    }).min(1);
    const validate=schema.validate(req.body,{abortEarly:false});
    if(validate.error)
    {
        return res.status(400).send(validate.error.details.map(detail=>detail.message).join('\n'));
    }
    next();
}

exports.validatePatients=validatePatients;
exports.validateUpdatePatients=validateUpdatePatients;