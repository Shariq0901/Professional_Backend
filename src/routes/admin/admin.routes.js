// import { Router } from "express";
// import { addProduct } from "../../controllers/product.controller.js";
// import { getMessages } from "../../controllers/visitor.controller.js";
const { Router } = require("express");
const { addProduct } = require("../../controllers/product.controller.js");
const { getMessages } = require("../../controllers/visitor.controller.js");

const router = Router();
router.route("/add-Product").post(addProduct);
router.route("/messages").get(getMessages)

module.exports=  router ;
