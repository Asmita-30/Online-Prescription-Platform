const express = require("express");
const { protect, requireRole } = require("../middleware/auth");
const {
    signupDoctor,
    loginDoctor,
    getDoctorProfile,
    updateDoctorProfile,
    getDoctorConsultations,
    getDoctorPrescriptions,
    getDoctorDashboard
} = require("../controllers/doctorController");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/signup", upload.single("profilePic"), signupDoctor);
router.post("/login", loginDoctor);

router.get("/me", protect, requireRole("doctor"), getDoctorProfile);
router.put("/me", protect, requireRole("doctor"), updateDoctorProfile);
router.get("/consultations", protect, requireRole("doctor"), getDoctorConsultations);
router.get("/prescriptions", protect, requireRole("doctor"), getDoctorPrescriptions);
router.get("/dashboard", protect, requireRole("doctor"), getDoctorDashboard);

module.exports = router;