const Joi=require('joi');

const validateUser=(req,res,next)=>{
    const schema=Joi.object({
        name:Joi.string().required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(8).required(),
        contact:Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        role:Joi.string().valid('Doctor','Nurse','Patient').required()
    });
    const validate=schema.validate(req.body,{abortEarly:false});
    if(validate.error)
    {
        return res.status(400).send(validate.error.details.map(detail=>detail.message).join('\n'));
    }
    next();
}

exports.validateUser=validateUser;