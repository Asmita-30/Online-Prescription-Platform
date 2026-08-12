const express = require("express");
const cors = require("cors");

const doctorRoutes = require("./routes/doctorRoutes");
const doctorsRoutes = require("./routes/doctorsRoutes");
const patientRoutes = require("./routes/patientRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();


const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://online-prescription-platform12.netlify.app",
    "https://online-prescription-platform-7kp8.onrender.com"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            console.log(" Blocked origin:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// OR - Allow all origins (for testing only)
// app.use(cors({
//     origin: "*",
//     credentials: true
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Online Prescription API is running",
        timestamp: new Date().toISOString()
    });
});

// Routes - /api prefix already added
app.use("/api/doctor", doctorRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

app.use(errorHandler);

module.exports = app;
