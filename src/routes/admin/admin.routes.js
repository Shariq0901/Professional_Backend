// import { Router } from "express";
// import { addProduct } from "../../controllers/product.controller.js";
// import { getMessages } from "../../controllers/visitor.controller.js";
const { Router } = require("express");
const { addProduct } = require("../../controllers/product.controller.js");
const { getMessages } = require("../../controllers/visitor.controller.js");
const metricsCollection=require("../../controllers/metrics.js")


const router = Router();
router.route("/add-Product").post(addProduct);
router.route("/messages").get(getMessages);
router.route("/metrics").get(metricsCollection);


module.exports=  router ;
