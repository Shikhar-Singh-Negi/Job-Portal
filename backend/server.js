import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import "./configs/instrument.js";
import * as Sentry from "@sentry/node";
import companyRoutes from "./routes/companyRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Initialize Express
const app = express();

// Database and Cloudinary connection logic
const connectAll = async () => {
  try {
    await connectDB();
    await connectCloudinary();
  } catch (err) {
    console.error("Connection failed:", err.message);
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  await connectAll();
  next();
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Port
const port = process.env.PORT || 3000;

Sentry.setupExpressErrorHandler(app);

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
