require('dotenv').config();
const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

// CORS Configuration
const corsOptions = {
    origin: "http://localhost:5174", // Make sure the frontend is running on this port
    credentials: true,  // Allow credentials (cookies) to be sent with requests
};
app.use(cors(corsOptions));

// Routes
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);

// Environment Variables
const port = process.env.PORT || 5000; // Default to 5000 if the PORT variable is not found

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(port, () => {
            console.log(`DB is connected & server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error);
    });

// Error Handling for 404 (Not Found)
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// Global Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});
