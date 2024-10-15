const express = require('express');
const { validateSignUpData } = require('../utils/validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post("/signup", async (req,res) =>{
    
    try {
      validateSignUpData(req);
      const { firstName , lastName , emailId, password } = req.body;
     const passwordHash = await bcrypt.hash(password,10);
 
      const user = new User({
         firstName,
         lastName,
         emailId,  
         password:passwordHash
      });
      await user.save();
      res.send("User added");
    }
    catch (err) {
     res.status(400).send("ERROR:" + err.message);
    }
 })

 router.post("/login" , async (req,res) =>{
    
    try{
         const { emailId , password } =req.body;
         const user = await User.findOne({emailId : emailId});
         if(!user){
            throw new Error("Email Not Found");
         }
         const isPasswordValid = await user.validatePassword(password);

         if(isPasswordValid){

               const token = await user.getJWT();
               

               res.cookie("token", token);
               res.send("Login Sucess");
         }
         else {
            throw new Error("Login Unsuccessfull, pasword incorrect");
         }

    }
    catch (err){
        res.status(400).send("ERROR:" + err.message);
    }
})

router.post("/logout", async (req,res) =>{
     
    res.cookie("token" , null, {
        expires:new Date(Date.now)
    });
    res.send("LOGGED OUT");
})


module.exports = router;