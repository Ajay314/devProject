const mongoose = require('mongoose');

const connectDB = async () =>{
 await mongoose.connect("mongodb+srv://ajay:ajay123@project.hat9u.mongodb.net/DevProject")
};

module.exports = connectDB;

