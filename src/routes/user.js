const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender skills";

userRouter.get("/user/requests", userAuth, async (req,res)=>{

    try{

        const loggesInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName"]);

        res.json({message: "Data fetched" , 
            data:connectionRequests});
    }
    catch(err){
        res.status(400).send("ERROR:" + err.message);
    }
})

userRouter.get("/user/connections" , userAuth, async (req,res)=>{

    try{

        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                {toUserId:loggedInUser._id, status :"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return
                row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({data});
    }
    catch(err){
        res.status(400).send("ERROR:" + err.message);
    }
})

userRouter.get("/feed", userAuth, async (req,res) =>{

    try{

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1 
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1 ) * limit;


        const connectionRequests = await ConnectionRequestModel.find({
            $or: [{ fromUserId:loggedInUser._id }, { toUserId:loggedInUser._id}],
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
    })

    console.log(hideUserFromFeed);

    const users = await User.find({
        $and : [
            { _id : { $nin :Array.from(hideUserFromFeed)}},
            {_id : { $ne : loggedInUser._id }},
        ]
    }).select(USER_SAFE_DATA).skip().limit(limit);

    res.send(users);
    }
    catch{
        res.status(400).send("ERROR:" + err.message);
    }
})

module.exports = userRouter;