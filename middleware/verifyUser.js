const verifyUser=(req,res,next)=>
{
    if(req.user._id !== req.params.id && req.user.role!=="Admin")
    {
        return res.status(403).send('Acess denied');
    }
    next();
}

exports.verifyUser=verifyUser;