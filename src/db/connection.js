require("dotenv").config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const Movie = require("../schemas/Movie.js")

const connection = {};

/* connect function way more complicated than needs to be for what our task was
 had corrupt db and was trying to figure out the errors 
 this could simply be  as below

 const connect = async () => {
const db = await mongoose.connect(process.env.MONGO_URI); 
 }

*/
const connect = async () => {
    if (connection.isConnected) {
        console.log('already connected');
        return;
    }

    if (mongoose.connections.length > 0) {
        connection.isConnected = mongoose.connections[0].readyState;
        if (connection.isConnected === 1) {
            console.log('use previous connection');
            return;
        }
        await mongoose.disconnect();
    }

    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log('new connection');
    connection.isConnected = db.connections[0].readyState;
}

const disconnect=async ()=> {
    console.log("trying to disconnect");
    if (connection.isConnected) {
        await mongoose.disconnect();
        connection.isConnected = false;
    }
}

module.exports = { connect, disconnect }