const Consultation = require("../models/Consultation");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const createConsultation = async (req, res, next) => {
    try {
        const {
            doctorId,
            currentIllness,
            recentSurgery,
            surgeryTimeSpan,
            isDiabetic,
            allergies,
            others,
            transactionId
        } = req.body;

        if (!doctorId || !transactionId || !currentIllness) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID, Transaction ID, and Current Illness are required."
            });
        }

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        const patient = await Patient.findById(req.user.id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found."
            });
        }

        const consultation = await Consultation.create({
            patient: req.user.id,
            doctor: doctorId,
            currentIllness,
            recentSurgery: recentSurgery || "",
            surgeryTimeSpan: surgeryTimeSpan || "",
            isDiabetic: isDiabetic || false,
            allergies: allergies || "",
            others: others || "",
            transactionId,
            status: "pending"
        });

        return res.status(201).json({
            success: true,
            message: "Consultation created successfully.",
            consultation
        });
    } catch (err) {
        next(err);
    }
};

const getConsultation = async (req, res, next) => {
    try {
        const consultation = await Consultation.findById(req.params.id)
            .populate("patient", "-password")
            .populate("doctor", "-password");

        if (!consultation) {
            return res.status(404).json({
                success: false,
                message: "Consultation not found."
            });
        }

        const isDoctor = req.user.role === "doctor" && 
            consultation.doctor._id.toString() === req.user.id;
        const isPatient = req.user.role === "patient" && 
            consultation.patient._id.toString() === req.user.id;

        if (!isDoctor && !isPatient) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this consultation."
            });
        }

        return res.status(200).json({
            success: true,
            consultation
        });
    } catch (err) {
        next(err);
    }
};

const getPatientConsultations = async (req, res, next) => {
    try {
        const consultations = await Consultation.find({ patient: req.user.id })
            .populate("doctor", "name specialty profilePicUrl")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            consultations
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createConsultation,
    getConsultation,
    getPatientConsultations
};