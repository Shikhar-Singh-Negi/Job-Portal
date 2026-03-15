import express from "express";
import {
  applyForJob,
  getUserData,
  getUserJobApplications,
  updateUserResume,
  registerUser,
  loginUser,
} from "../controllers/userController.js";
import upload from "../configs/multer.js";
import { protectUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// register user
router.post("/register", registerUser);

// login user
router.post("/login", loginUser);

// get user data
router.get("/user", protectUser, getUserData);

// apply for job
router.post("/apply", protectUser, applyForJob);

// get applied jobs data
router.get("/applications", protectUser, getUserJobApplications);

// update user profile
router.post(
  "/update-resume",
  protectUser,
  upload.single("resume"),
  updateUserResume
);

export default router;
