import { Router } from "express";
import { addProduct } from "../../controllers/product.controller";
import { getMessages } from "../../controllers/visitor.controller";

const router = Router();
router.route("/add-Product").post(addProduct);
router.route("/messages").get(getMessages)

export { router };
