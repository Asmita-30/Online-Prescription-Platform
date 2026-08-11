const express = require("express");
const cors = require("cors");

const doctorRoutes = require("./routes/doctorRoutes");
const doctorsRoutes = require("./routes/doctorsRoutes");
const patientRoutes = require("./routes/patientRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Online Prescription API is running"
    });
});

app.use("/api/doctor", doctorRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

app.use(errorHandler);

module.exports = app;