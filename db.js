const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.MONGODB_URL;

mongoose.set('strictQuery', false);

const connectToMongo = () =>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;