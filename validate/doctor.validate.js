const Joi=require('joi');
const validatedoctors=(req,res,next)=>
{
    const schema=Joi.object({
        name:Joi.string().min(3).max(255).required(),
        email:Joi.string().email().required(),
        specialization:Joi.string().required(),
        contact:Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        availability:Joi.array().items(Joi.string()).min(1).required()
    });
    const validate=schema.validate(req.body,{abortEarly:false});
    if(validate.error)
    {
        return res.status(400).send(validate.error.details.map(detail=>detail.message).join('\n'));
    }
    next();
}
const validateUpdatedoctors=(req,res,next)=>
    {
        const schema=Joi.object({
            name:Joi.string().min(3).max(255),
            email:Joi.string().email(),
            specialization:Joi.string(),
            password:Joi.string().min(8),
            contact:Joi.string().length(10).pattern(/^[0-9]+$/),
            availability:Joi.array().items(Joi.string()).min(1)
        }).min(1);
        const validate=schema.validate(req.body,{abortEarly:false});
        if(validate.error)
        {
            return res.status(400).send(validate.error.details.map(detail=>detail.message).join('\n'));
        }
        next();
    }

exports.validatedoctors=validatedoctors;
exports.validateUpdatedoctors=validateUpdatedoctors;