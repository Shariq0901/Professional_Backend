import mongoose from "mongoose"
import {data_base_name} from "../constants.js"
const connection= async () => {
    try {
        console.log(process.env.db_url);
        const connectionInstance = await mongoose.connect(
          `${process.env.db_url}/${data_base_name}`
        );
        console.log(`\nmongodb connected with host ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("mongodb Connection error", error)
        process.exit(1)
    }
}
export default connection
