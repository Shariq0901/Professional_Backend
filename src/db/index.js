// import mongoose from "mongoose"
// import {data_base_name} from "../constants.js"
const mongoose = require("mongoose");
const { data_base_name } = require("../constants.js");
const connection= async () => {
    try {
        
        const connectionInstance = await mongoose.connect(
          `${process.env.DB_URL}/${data_base_name}`
        );
        console.log(`\nmongodb connected with host ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("mongodb Connection error", error)
        process.exit(1)
    }
}
module.exports = connection;
