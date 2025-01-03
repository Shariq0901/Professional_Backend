// import dotenv from "dotenv";
// import connection from "./db/index.js";
// import { app } from "./app.js";
const dotenv = require("dotenv");
const connection = require("./db/index.js");
const { app } = require("./app.js");

dotenv.config({
  path: "./.env",
});
console.log("hello commit")

connection()
  .then(() => {
    app.listen(process.env.PORT || 8000);
  })
  .catch((error) => {
    console.log("you got a error while connecting the mongodb", error);
  });
