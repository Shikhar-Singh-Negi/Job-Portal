import jobApplicationModel from "../models/jobApplicationModel.js";
import jobModel from "../models/jobModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// register user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "Details Missing",
    });
  }

  try {
    const userExists = await userModel.findOne({ email });

    if (userExists) {
      return res.json({
        success: false,
        message: "User already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({
      success: true,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image,
        resume: newUser.resume,
      },
      token: generateToken(newUser._id),
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          resume: user.resume,
        },
        token: generateToken(user._id),
      });
    } else {
      res.json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// get user data
export const getUserData = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// apply for job
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user._id;

  try {
    const isAlreadyApplied = await jobApplicationModel({ jobId, userId });

    if (isAlreadyApplied.length > 0) {
      return res.json({
        success: false,
        message: "Already Applied",
      });
    }

    const jobData = await jobModel.findById(jobId);

    if (!jobData) {
      return res.json({
        success: false,
        message: "Job Not Found",
      });
    }

    await jobApplicationModel.create({
      companyId: jobData.companyId,
      userId,
      jobId,
      date: Date.now(),
    });

    res.json({
      success: true,
      message: "Applied Successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// get user applied applications
export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await jobApplicationModel
      .find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .exec();

    if (!applications) {
      return res.json({
        success: false,
        message: "No Job Applications Found For This User",
      });
    }

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// update user profile
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const resumeFile = req.file;
    const userData = await userModel.findById(userId);

    if (resumeFile) {
      const uploadResume = await cloudinary.uploader.upload(resumeFile.path);
      userData.resume = uploadResume.secure_url;
    }

    await userData.save();

    return res.json({
      success: true,
      message: "Resume Updated",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
