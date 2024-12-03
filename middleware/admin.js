const isAdmin=(req,res,next)=>
{
    if(req.user.role !=="Admin")
    {
        return res.status(403).send('Acess denied');
    }
    next();
}

exports.admin=isAdmin;