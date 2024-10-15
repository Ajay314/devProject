const express = require('express');
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validator");

const res = require('express/lib/response');

const profileRouter = express.Router();

profileRouter.get("/profile",userAuth, async (req,res) =>{

    try {

    const user = req.user;
    
    res.send(user);
}
catch (err){
    res.status(400).send("ERROR: " + err.message);
}


})

profileRouter.patch("/profile/edit" , userAuth, async (req,res) =>{

    try {
       if (!validateEditProfileData(req)){
          throw new Error("Invalid Edit Request");
        };

        const loggedInUser = req.user;
       //loggedInUser.firstName = req.body.firstName;

       Object.keys(req.body).forEach(key => (loggedInUser[key]= req.body[key]));

       await loggedInUser.save();

      // res.send(`${loggedInUser.firstName},  Success Update Profile`);
        res.json({
            message:`${loggedInUser.firstName},  Success Update Profile` , 
            data:loggedInUser
        })



    }
    catch (err) {
        res.status(400).send("ERROR:" + err.message);
    }
})


module.exports = profileRouter;