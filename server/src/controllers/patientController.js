const bcrypt = require("bcryptjs");
const Patient = require("../models/Patient");
const Prescription = require("../models/Prescription");
const cloudinary = require("../config/cloudinary");
const generateToken = require("../utils/generateToken");

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "online-prescription/patients" },
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
        stream.end(buffer);
    });
};

const signupPatient = async (req, res, next) => {
    try {
        const { name, email, phone, password, age, historyOfSurgery, historyOfIllness } = req.body;

        if (!name || !email || !phone || !password || age === undefined) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        const existingPatient = await Patient.findOne({
            $or: [{ email: email.toLowerCase() }, { phone }]
        });

        if (existingPatient) {
            return res.status(409).json({
                success: false,
                message: "Email or phone already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        let profilePicUrl = "";
        if (req.file) {
            const uploaded = await uploadToCloudinary(req.file.buffer);
            profilePicUrl = uploaded.secure_url;
        }

        let illnesses = [];
        if (historyOfIllness) {
            illnesses = historyOfIllness
                .split(",")
                .map(item => item.trim())
                .filter(Boolean);
        }

        const patient = await Patient.create({
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            age: Number(age),
            historyOfSurgery: historyOfSurgery || "",
            historyOfIllness: illnesses,
            profilePicUrl
        });

        const token = generateToken(patient._id, "patient");

        res.status(201).json({
            success: true,
            message: "Patient registered successfully",
            token,
            user: {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                phone: patient.phone,
                age: patient.age,
                historyOfSurgery: patient.historyOfSurgery,
                historyOfIllness: patient.historyOfIllness,
                profilePicUrl: patient.profilePicUrl,
                role: "patient"
            }
        });
    } catch (err) {
        next(err);
    }
};

const loginPatient = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const patient = await Patient.findOne({ email: email.toLowerCase() });

        if (!patient) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(password, patient.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(patient._id, "patient");

        res.json({
            success: true,
            message: "Patient login successful",
            token,
            user: {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                phone: patient.phone,
                age: patient.age,
                historyOfSurgery: patient.historyOfSurgery,
                historyOfIllness: patient.historyOfIllness,
                profilePicUrl: patient.profilePicUrl,
                role: "patient"
            }
        });
    } catch (err) {
        next(err);
    }
};

const getPatientProfile = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.user.id).select("-password");
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }
        res.status(200).json({
            success: true,
            patient
        });
    } catch (err) {
        next(err);
    }
};

const getPatientPrescriptions = async (req, res, next) => {
    try {
        const prescriptions = await Prescription.find({ patient: req.user.id })
            .populate("doctor", "name specialty profilePicUrl")
            .populate("consultation")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            prescriptions
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signupPatient,
    loginPatient,
    getPatientProfile,
    getPatientPrescriptions
};