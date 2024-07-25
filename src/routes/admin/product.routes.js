import { getProducts } from "../../controllers/product.controller.js";
import { Router } from "express";
const router = Router();
router.route("/Products").get(getProducts);
export default router;
