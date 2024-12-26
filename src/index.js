// import dotenv from "dotenv";
// import connection from "./db/index.js";
// import { app } from "./app.js";
const dotenv = require("dotenv");
const connection = require("./db/index.js");
const { app } = require("./app.js");

dotenv.config({
  path: "./.env",
});
console.log(process.env.PORT);
console.log(process.env.DB_URL);

connection()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Port is listening at ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("you got a error while connecting the mongodb", error);
  });
