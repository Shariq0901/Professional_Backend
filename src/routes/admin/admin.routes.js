import { Router } from "express";
import { addProduct } from "../../controllers/product.controller.js";
import { getMessages } from "../../controllers/visitor.controller.js";

const router = Router();
router.route("/add-Product").post(addProduct);
router.route("/messages").get(getMessages)

export default  router ;
