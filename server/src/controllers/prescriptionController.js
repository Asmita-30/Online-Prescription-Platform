const Prescription = require("../models/Prescription");
const Consultation = require("../models/Consultation");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const fs = require("fs");
const { generatePrescriptionPdf } = require("../services/pdfService");
const { sendPrescriptionEmail } = require("../services/emailService");

const createPrescription = async (req, res, next) => {
    try {
        const { consultation, careToBeTaken, medicines } = req.body;

        console.log("📝 Creating prescription for:", consultation);

        if (!consultation) {
            return res.status(400).json({
                success: false,
                message: "Consultation is required."
            });
        }

        if (!careToBeTaken || !careToBeTaken.trim()) {
            return res.status(400).json({
                success: false,
                message: "Care to be Taken is required."
            });
        }

        const consultationDoc = await Consultation.findById(consultation)
            .populate("patient")
            .populate("doctor");

        if (!consultationDoc) {
            return res.status(404).json({
                success: false,
                message: "Consultation not found."
            });
        }

        if (consultationDoc.doctor._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to prescribe for this consultation."
            });
        }

        const existing = await Prescription.findOne({ consultation });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Prescription already exists. Use edit instead."
            });
        }

        const prescription = await Prescription.create({
            consultation,
            doctor: consultationDoc.doctor._id,
            patient: consultationDoc.patient._id,
            careToBeTaken: careToBeTaken.trim(),
            medicines: medicines ? medicines.trim() : "",
            sentToPatient: false
        });

        console.log("✅ Prescription created:", prescription._id);

        consultationDoc.status = "prescribed";
        await consultationDoc.save();

        await generatePrescriptionPdf(prescription._id);

        const updatedPrescription = await Prescription.findById(prescription._id);

        return res.status(201).json({
            success: true,
            message: "Prescription created successfully.",
            prescription: updatedPrescription
        });
    } catch (err) {
        console.error("❌ Create error:", err);
        next(err);
    }
};

const updatePrescription = async (req, res, next) => {
    try {
        const prescription = await Prescription.findById(req.params.id);

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: "Prescription not found."
            });
        }

        if (prescription.doctor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this prescription."
            });
        }

        const { careToBeTaken, medicines } = req.body;

        if (!careToBeTaken || !careToBeTaken.trim()) {
            return res.status(400).json({
                success: false,
                message: "Care to be Taken is required."
            });
        }

        prescription.careToBeTaken = careToBeTaken.trim();
        prescription.medicines = medicines ? medicines.trim() : "";
        prescription.sentToPatient = false;

        await prescription.save();

        await generatePrescriptionPdf(prescription._id);

        console.log("✅ Prescription updated:", prescription._id);

        return res.status(200).json({
            success: true,
            message: "Prescription updated successfully.",
            prescription
        });
    } catch (err) {
        console.error("❌ Update error:", err);
        next(err);
    }
};

const getPrescription = async (req, res, next) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate("patient", "-password")
            .populate("doctor", "-password")
            .populate("consultation");

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: "Prescription not found."
            });
        }

        const isDoctor = req.user.role === "doctor" && 
            prescription.doctor._id.toString() === req.user.id;
        const isPatient = req.user.role === "patient" && 
            prescription.patient._id.toString() === req.user.id;

        if (!isDoctor && !isPatient) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this prescription."
            });
        }

        return res.status(200).json({
            success: true,
            prescription
        });
    } catch (err) {
        console.error("❌ Get error:", err);
        next(err);
    }
};

const getPrescriptionPdf = async (req, res, next) => {
    try {
        const prescription = await Prescription.findById(req.params.id);

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: "Prescription not found."
            });
        }

        const isDoctor = req.user.role === "doctor" && 
            prescription.doctor.toString() === req.user.id;
        const isPatient = req.user.role === "patient" && 
            prescription.patient.toString() === req.user.id;

        if (!isDoctor && !isPatient) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to download this prescription."
            });
        }

        const filePath = await generatePrescriptionPdf(prescription._id);
        return res.download(filePath, `prescription-${prescription._id}.pdf`);
    } catch (err) {
        console.error("❌ Download error:", err);
        next(err);
    }
};

const sendPrescription = async (req, res, next) => {
    try {
        console.log("========================================");
        console.log("📤 SEND PRESCRIPTION");
        console.log("========================================");
        console.log(`📋 ID: ${req.params.id}`);
        console.log(`👨‍⚕️ Doctor: ${req.user.id}`);

        const prescription = await Prescription.findById(req.params.id)
            .populate("patient")
            .populate("doctor")
            .populate("consultation");

        if (!prescription) {
            console.log("❌ Not found");
            return res.status(404).json({
                success: false,
                message: "Prescription not found."
            });
        }

        if (prescription.doctor._id.toString() !== req.user.id) {
            console.log("❌ Unauthorized");
            return res.status(403).json({
                success: false,
                message: "You are not authorized to send this prescription."
            });
        }

        if (!prescription.patient.email) {
            console.log("❌ Patient has no email");
            return res.status(400).json({
                success: false,
                message: "Patient does not have an email address."
            });
        }

        console.log("📧 Patient:", prescription.patient.email);
        console.log("👤 Name:", prescription.patient.name);
        console.log("👨‍⚕️ Doctor:", prescription.doctor.name);

        console.log("📄 Generating PDF...");
        const pdfPath = await generatePrescriptionPdf(prescription._id);
        console.log("✅ PDF generated");

        console.log("📧 Sending email...");
        await sendPrescriptionEmail({
            to: prescription.patient.email,
            patientName: prescription.patient.name,
            doctorName: prescription.doctor.name,
            pdfPath: pdfPath,
            careToBeTaken: prescription.careToBeTaken,
            medicines: prescription.medicines || "None prescribed"
        });

        console.log("✅ Email sent!");

        prescription.sentToPatient = true;
        await prescription.save();

        try {
            if (fs.existsSync(pdfPath)) {
                fs.unlinkSync(pdfPath);
                console.log("🗑️ Temp PDF deleted");
            }
        } catch (err) {
            console.log("Could not delete temp PDF:", err.message);
        }

        console.log("========================================");
        console.log("✅ PRESCRIPTION SENT!");
        console.log("========================================");

        return res.status(200).json({
            success: true,
            message: "Prescription sent to patient via email successfully.",
            prescription
        });
    } catch (err) {
        console.error("❌ Send error:", err);
        next(err);
    }
};

const getDoctorPrescriptions = async (req, res, next) => {
    try {
        console.log(`📋 Fetching prescriptions for doctor: ${req.user.id}`);
        
        const prescriptions = await Prescription.find({ doctor: req.user.id })
            .populate("patient", "name email phone age profilePicUrl")
            .populate("consultation")
            .sort({ createdAt: -1 });

        console.log(`✅ Found ${prescriptions.length} prescriptions`);

        return res.status(200).json({
            success: true,
            prescriptions
        });
    } catch (err) {
        console.error("❌ Get doctor prescriptions error:", err);
        next(err);
    }
};

const getPatientPrescriptions = async (req, res, next) => {
    try {
        console.log(`📋 Fetching prescriptions for patient: ${req.user.id}`);
        
        const prescriptions = await Prescription.find({ patient: req.user.id })
            .populate("doctor", "name specialty profilePicUrl")
            .populate("consultation")
            .sort({ createdAt: -1 });

        console.log(`✅ Found ${prescriptions.length} prescriptions`);

        return res.status(200).json({
            success: true,
            prescriptions
        });
    } catch (err) {
        console.error("❌ Get patient prescriptions error:", err);
        next(err);
    }
};

module.exports = {
    createPrescription,
    updatePrescription,
    getPrescription,
    getPrescriptionPdf,
    sendPrescription,
    getDoctorPrescriptions,
    getPatientPrescriptions
};