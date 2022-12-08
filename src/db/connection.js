require("dotenv").config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const Movie = require("../schemas/Movie.js")

const connection = {};

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

const read = async(query)=> {
    console.log("find filter is: ",query);
    let results = await Movie.find(query,"title actor director rating addedAT updatedAt"); 
    return results;
}

const disconnect=async ()=> {
    console.log("trying to disconnect");
    if (connection.isConnected) {
        await mongoose.disconnect();
        connection.isConnected = false;
    }
}

module.exports = { connect, disconnect ,read}