const express = require("express");
const { protect, requireRole } = require("../middleware/auth");
const {
    createConsultation,
    getConsultation,
    getPatientConsultations
} = require("../controllers/consultationController");

const router = express.Router();

router.post("/", protect, requireRole("patient"), createConsultation);
router.get("/patient", protect, requireRole("patient"), getPatientConsultations);
router.get("/:id", protect, getConsultation);

module.exports = router;