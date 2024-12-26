// import { getProducts } from "../../controllers/product.controller.js";
// import { Router } from "express";
const { getProducts } = require("../../controllers/product.controller.js");
const { Router } = require("express");

const router = Router();
router.route("/Products").get(getProducts);
module.exports = router;