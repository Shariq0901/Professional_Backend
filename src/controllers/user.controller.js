import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async(req, res) => {
    res.status(200).json({"msg":"haan ji"})
})
const loginUser = asyncHandler(async (req, res) => {
    res.status(200).json({"msg":"login Successfully"})
})

export {registerUser,loginUser}