const express=require('express');
const router=express.Router();
const authValidate=require('../validate/auth.validate')
const authService=require('../service/auth.service');

router.post('/',
    authValidate.validateAuth,
    authService.authUser
);

module.exports=router;