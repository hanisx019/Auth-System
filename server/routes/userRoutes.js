import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserDetails } from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.get("/data",userAuth,getUserDetails);

export default userRoute;