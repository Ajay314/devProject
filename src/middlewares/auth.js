const jwt = require('jsonwebtoken');
const User = require("../models/user");

const userAuth = async (req,res,next) =>{
    
    try{
    
    const cookies = req.cookies;

    const {token} = cookies;
    if(!token){
        throw new Error("Token not Valid");
    }

    const decodedObj = await jwt.verify(token,"Devtinder@314");

    const { _id } = decodedObj;

  const user = await User.findById(_id);
  if(!user){
    throw new Error("User not Found");
  }
  
req.user=user;
  next();
}
catch (err){
    res.status(400).send("ERROR:" + err.message);

}
}

module.exports = { userAuth } ;