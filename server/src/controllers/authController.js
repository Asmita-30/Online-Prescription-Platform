const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const doctorSignup = async (req, res, next) => {
    try {
        const { name, email, phone, password, specialty, yearsExperience } = req.body;
        const profilePicUrl = req.file ? req.file.path : null;

        const existingDoctor = await Doctor.findOne({ $or: [{ email }, { phone }] });
        if (existingDoctor) {
            return res.status(400).json({
                success: false,
                message: "Doctor with this email or phone already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const doctor = await Doctor.create({
            name,
            email,
            phone,
            password: hashedPassword,
            specialty,
            yearsExperience: parseFloat(yearsExperience) || 0,
            profilePicUrl
        });

        const token = generateToken(doctor._id, "doctor");

        res.status(201).json({
            success: true,
            message: "Doctor registered successfully.",
            token,
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                specialty: doctor.specialty,
                profilePicUrl: doctor.profilePicUrl,
                role: "doctor"
            }
        });
    } catch (err) {
        next(err);
    }
};

const doctorLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password."
            });
        }

        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        const token = generateToken(doctor._id, "doctor");

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                specialty: doctor.specialty,
                profilePicUrl: doctor.profilePicUrl,
                role: "doctor"
            }
        });
    } catch (err) {
        next(err);
    }
};

const patientSignup = async (req, res, next) => {
    try {
        const { name, email, phone, password, age, historyOfSurgery, historyOfIllness } = req.body;
        const profilePicUrl = req.file ? req.file.path : null;

        const existingPatient = await Patient.findOne({ $or: [{ email }, { phone }] });
        if (existingPatient) {
            return res.status(400).json({
                success: false,
                message: "Patient with this email or phone already exists."
            });
        }

        const illnessArray = historyOfIllness 
            ? historyOfIllness.split(",").map(item => item.trim()).filter(item => item)
            : [];

        const hashedPassword = await bcrypt.hash(password, 10);

        const patient = await Patient.create({
            name,
            email,
            phone,
            password: hashedPassword,
            age: parseInt(age) || 0,
            historyOfSurgery: historyOfSurgery || "",
            historyOfIllness: illnessArray,
            profilePicUrl
        });

        const token = generateToken(patient._id, "patient");

        res.status(201).json({
            success: true,
            message: "Patient registered successfully.",
            token,
            patient: {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                age: patient.age,
                profilePicUrl: patient.profilePicUrl,
                historyOfIllness: patient.historyOfIllness,
                role: "patient"
            }
        });
    } catch (err) {
        next(err);
    }
};

const patientLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password."
            });
        }

        const patient = await Patient.findOne({ email });
        if (!patient) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials."
            });
        }

        const token = generateToken(patient._id, "patient");

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            patient: {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                age: patient.age,
                profilePicUrl: patient.profilePicUrl,
                historyOfIllness: patient.historyOfIllness,
                role: "patient"
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    doctorSignup,
    doctorLogin,
    patientSignup,
    patientLogin
};