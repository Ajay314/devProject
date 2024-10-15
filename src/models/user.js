const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema ({
    firstName: {
        type : String,
        required : true,
        minlength : 4,
        maxlength :50
    },
    lastName : {
        type : String
    },
    emailId : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    age : {
        type : Number
    },
    gender : {
        type : String
    }
}
,{
    timestamps:true
})

//no arrow function 

userSchema.methods.getJWT = async function() {

    const user = this;

    const token = await jwt.sign({_id : user._id}, "Devtinder@314", {expiresIn: "1h"});

    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
     
    const user  = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );

    return isPasswordValid;
}

const User = mongoose.model("User",userSchema);

module.exports = User;