import dotenv from "dotenv";
import connection from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./.env",
});
console.log(process.env.PORT)
connection()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Port is listening at ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("you got a error while connecting the mongodb", error);
  });