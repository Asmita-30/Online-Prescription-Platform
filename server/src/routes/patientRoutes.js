const express = require("express");
const { protect, requireRole } = require("../middleware/auth");
const {
    signupPatient,
    loginPatient,
    getPatientProfile,
    getPatientPrescriptions
} = require("../controllers/patientController");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/signup", upload.single("profilePic"), signupPatient);
router.post("/login", loginPatient);

router.get("/me", protect, requireRole("patient"), getPatientProfile);
router.get("/prescriptions", protect, requireRole("patient"), getPatientPrescriptions);

module.exports = router;