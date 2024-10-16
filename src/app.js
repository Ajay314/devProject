const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');



app.use(express.json());
app.use(cookieParser());

const router = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request")

app.use("/", router);
app.use("/", profileRouter);
app.use("/",requestRouter);







app.get("/user", async (req,res) =>{
       const email = req.body.emailId;

       try {
        const user = await User.find({ emailId : email });
        if(user.length===0){
            res.status(404).send("User not found")
        }
        
        res.send(user);
       }
       catch {
        res.status(400).send("Something went wrong");
       }
})

app.get("/feed", async (req,res) =>{
    try {
        const user = await User.find({});
        res.send(user);
    }
    catch (err){
       res.status(400).send("Error fetching Data");
    }
})

app.delete("/user" , async (req,res) =>{
      const id = req.body.id;

    try{
        const user = await User.findByIdAndDelete(id);
        res.send("Deleted Successfully..") 
    }
    catch (err){
        res.status(400).send("Error Deleting Data");
     }
})

app.patch("/user", async (req,res) => {
     const id = req.body.id;
    const data = req.body;
   

    try{
        await User.findByIdAndUpdate({ _id : id }, data);
        res.send("Updatedd......")
    }
    catch (err){
        res.status(400).send("Error Deleting Data");
     }
})


connectDB().then(()=> {
    console.log("Connected to Database");
    app.listen(3000 , ()=> {
        console.log("Server is Listening on port 3000 ");
    }); 
}).catch((err) =>{
    console.log("Error in connecting with DataBase.....")
});