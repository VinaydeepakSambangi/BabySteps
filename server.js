const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // for parsing application/json

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Define routes
app.use("/doctors", require("./routes/doctorRoutes"));
app.use("/appointments", require("./routes/appointmentRoutes"));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
