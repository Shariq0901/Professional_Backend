import { Router } from "express";
import { visitorValidation } from "../../middlewares/authMiddlewares";
import { contact } from "../../controllers/visitor.controller";
const router = Router();

router.route("/contact").post(visitorValidation, contact);

export default router;
