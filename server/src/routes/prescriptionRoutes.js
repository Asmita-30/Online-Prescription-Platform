const express = require("express");
const { protect, requireRole } = require("../middleware/auth");
const {
    createPrescription,
    updatePrescription,
    getPrescription,
    getPrescriptionPdf,
    sendPrescription,
    getDoctorPrescriptions,
    getPatientPrescriptions
} = require("../controllers/prescriptionController");

const router = express.Router();

router.post("/", protect, requireRole("doctor"), createPrescription);
router.put("/:id", protect, requireRole("doctor"), updatePrescription);
router.post("/:id/send", protect, requireRole("doctor"), sendPrescription);
router.get("/doctor", protect, requireRole("doctor"), getDoctorPrescriptions);

router.get("/patient", protect, requireRole("patient"), getPatientPrescriptions);

router.get("/:id", protect, getPrescription);
router.get("/:id/pdf", protect, getPrescriptionPdf);

module.exports = router;