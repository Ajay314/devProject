const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const userRouter = express.Router();


userRouter.get("/user/requests", userAuth, async (req,res)=>{

    try{

        const loggesInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId:loggedInUser._id,

        }) 
        res.json({message: "Data fetched" , 
            data:connectionRequests});
    }
    catch(err){
        res.status(400).send("ERROR:" + err.message);
    }
})


module.exports = userRouter;