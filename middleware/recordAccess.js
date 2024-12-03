const recordAccess=(req,res,next)=>
{
    if(!["Admin","Doctor","Nurse"].includes(req.user.role))    
    {
        return res.status(403).send('Acess denied');
    }
    next();
}

exports.recordAccess=recordAccess;