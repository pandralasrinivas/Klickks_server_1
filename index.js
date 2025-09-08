const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(cors());

// API routes
app.use("/api", authRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// Handle all other routes with the React app
// Option 1 (preferred)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
