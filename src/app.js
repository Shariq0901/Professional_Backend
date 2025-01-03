// import express, { urlencoded } from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const client = require("prom-client") // for metric collection
const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(
  cors({
    origin: process.env.Cross_origin,
    credentials: true,
  })
);
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });
app.use(cookieParser());
app.use(express.urlencoded({ extended: "true", limit: "16kb" }));
app.use(express.static("public"));

//  import Routes
// import userRouter from "./routes/user/user.routes.js";
// import productRouter from "./routes/admin/product.routes.js";
// import {router as visitorRouter} from "./routes/visitor/visitor.routes.js";
// import adminRouter from "./routes/admin/admin.routes.js"
// CommonJS imports
const userRouter = require("./routes/user/user.routes.js");
const productRouter = require("./routes/admin/product.routes.js");
const { router: visitorRouter } = require("./routes/visitor/visitor.routes.js");
const adminRouter = require("./routes/admin/admin.routes.js");

// Routes Declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/visitor", visitorRouter);
app.use("/api/v1/admin", adminRouter);
app.get("/", (req, res) => {
  res.status(200).json({"message":"hello! hey there...."})
})
module.exports= { app };
