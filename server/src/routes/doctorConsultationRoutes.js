const express = require("express");
const { protect, requireRole } = require("../middleware/auth");
const { getDoctorConsultations } = require("../controllers/doctorController");

const router = express.Router();

router.get("/consultations", protect, requireRole("doctor"), getDoctorConsultations);

module.exports = router;