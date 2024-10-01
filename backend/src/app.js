const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again later.",
});

// Apply rate limiter to all requests
app.use(limiter);

// Routes
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // Export the app instance
