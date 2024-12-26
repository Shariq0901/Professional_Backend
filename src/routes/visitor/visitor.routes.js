import { Router } from "express";
import { visitorValidation } from "../../middlewares/authMiddlewares.js";
import { contact } from "../../controllers/visitor.controller.js";
const router = Router();

router.route("/contact").post(visitorValidation, contact);

export  {router};
