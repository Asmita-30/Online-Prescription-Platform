const express = require("express");
const { protect, requireRole } = require("../middleware/auth");
const { getDoctors, getDoctorById } = require("../controllers/doctorController");

const router = express.Router();

router.get("/", protect, requireRole("patient"), getDoctors);
router.get("/:id", protect, requireRole("patient"), getDoctorById);

module.exports = router;