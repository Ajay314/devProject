const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validator');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req,res) =>{
    
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

app.post("/login" , async (req,res) =>{
    
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

app.get("/profile",userAuth, async (req,res) =>{

    try {

    const user = req.user;
    
    res.send(user);
}
catch (err){
    res.status(400).send("ERROR: " + err.message);
}


})

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