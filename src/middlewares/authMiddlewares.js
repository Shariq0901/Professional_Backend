import jwt from "jsonwebtoken";
import { body} from "express-validator";
const authJwt = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhoneNumber = (phone) => /^[7-9]\d{9}$/.test(phone);
const registerValidation = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name should be at least 3 letters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name should contain only letters"),
  body("username")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Username should contain only letters and numbers"),
  body("phone")
    .custom((value) => validatePhoneNumber(value))
    .withMessage("Phone number should be in Indian format"),
  body("email")
    .custom((value) => validateEmail(value))
    .withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long"),
];

export {registerValidation,authJwt}
