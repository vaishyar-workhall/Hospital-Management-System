const Joi=require('joi');
const validateAuth=(req,res,next)=>
{
    const schema=Joi.object({
        email:Joi.string().min(3).required().email(),
        password:Joi.string().min(3).required()
    });
    const validate=schema.validate(req.body,{abortEarly:false});
    if(validate.error)
    {
        return res.status(400).send(validate.error.details.map(detail=>detail.message).join('\n'));
    }
    next();
}

exports.validateAuth=validateAuth;