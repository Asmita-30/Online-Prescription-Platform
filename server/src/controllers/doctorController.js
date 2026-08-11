const bcrypt = require("bcryptjs");
const Doctor = require("../models/Doctor");
const Consultation = require("../models/Consultation");
const Prescription = require("../models/Prescription");
const cloudinary = require("../config/cloudinary");
const generateToken = require("../utils/generateToken");

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "online-prescription/doctors" },
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

const signupDoctor = async (req, res, next) => {
    try {
        const { name, email, phone, password, specialty, yearsExperience } = req.body;

        console.log("📝 Doctor signup:", { name, email, phone, specialty, yearsExperience });

        if (!name || !email || !phone || !password || !specialty || yearsExperience === undefined) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        const existingDoctor = await Doctor.findOne({
            $or: [{ email: email.toLowerCase() }, { phone }]
        });

        if (existingDoctor) {
            console.log("❌ Doctor exists:", email);
            const field = existingDoctor.email === email.toLowerCase() ? 'email' : 'phone';
            return res.status(409).json({
                success: false,
                message: `Doctor with this ${field} already registered. Please use a different ${field}.`
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        let profilePicUrl = "";
        if (req.file) {
            console.log("📤 Uploading profile pic...");
            const uploaded = await uploadToCloudinary(req.file.buffer);
            profilePicUrl = uploaded.secure_url;
            console.log("✅ Profile pic uploaded:", profilePicUrl);
        }

        const doctor = await Doctor.create({
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            specialty,
            yearsExperience: parseFloat(yearsExperience),
            profilePicUrl
        });

        console.log("✅ Doctor created:", doctor._id);

        const token = generateToken(doctor._id, "doctor");

        return res.status(201).json({
            success: true,
            message: "Doctor registered successfully",
            token,
            user: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                phone: doctor.phone,
                specialty: doctor.specialty,
                yearsExperience: doctor.yearsExperience,
                profilePicUrl: doctor.profilePicUrl,
                role: "doctor"
            }
        });
    } catch (err) {
        console.error("❌ Signup error:", err);
        next(err);
    }
};

const loginDoctor = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        console.log("📝 Doctor login:", { email });

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const doctor = await Doctor.findOne({ email: email.toLowerCase() });

        if (!doctor) {
            console.log("❌ Doctor not found:", email);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(password, doctor.password);

        if (!passwordMatch) {
            console.log("❌ Invalid password for:", email);
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        console.log("✅ Doctor logged in:", doctor._id);

        const token = generateToken(doctor._id, "doctor");

        return res.json({
            success: true,
            message: "Doctor login successful",
            token,
            user: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                phone: doctor.phone,
                specialty: doctor.specialty,
                yearsExperience: doctor.yearsExperience,
                profilePicUrl: doctor.profilePicUrl,
                role: "doctor"
            }
        });
    } catch (err) {
        console.error("❌ Login error:", err);
        next(err);
    }
};

const getDoctorProfile = async (req, res, next) => {
    try {
        console.log("📝 Fetching profile:", req.user.id);

        const doctor = await Doctor.findById(req.user.id).select("-password");

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        return res.json({
            success: true,
            doctor
        });
    } catch (err) {
        console.error("❌ Get profile error:", err);
        next(err);
    }
};

const updateDoctorProfile = async (req, res, next) => {
    try {
        const { name, specialty, yearsExperience, phone } = req.body;
        const doctor = await Doctor.findById(req.user.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        if (name) doctor.name = name;
        if (specialty) doctor.specialty = specialty;
        if (yearsExperience) doctor.yearsExperience = parseFloat(yearsExperience);
        if (phone) doctor.phone = phone;

        await doctor.save();

        console.log("✅ Profile updated:", doctor._id);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                phone: doctor.phone,
                specialty: doctor.specialty,
                yearsExperience: doctor.yearsExperience,
                profilePicUrl: doctor.profilePicUrl
            }
        });
    } catch (err) {
        console.error("❌ Update error:", err);
        next(err);
    }
};

const getDoctors = async (req, res, next) => {
    try {
        console.log("📝 Fetching all doctors");

        const doctors = await Doctor.find()
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: doctors.length,
            doctors
        });
    } catch (err) {
        console.error("❌ Get doctors error:", err);
        next(err);
    }
};

const getDoctorById = async (req, res, next) => {
    try {
        console.log("📝 Fetching doctor:", req.params.id);

        const doctor = await Doctor.findById(req.params.id).select("-password");

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        return res.status(200).json({
            success: true,
            doctor
        });
    } catch (err) {
        console.error("❌ Get doctor error:", err);
        next(err);
    }
};

const getDoctorConsultations = async (req, res, next) => {
    try {
        console.log("📝 Fetching consults for doctor:", req.user.id);

        const consultations = await Consultation.find({ doctor: req.user.id })
            .populate("patient", "name email phone age profilePicUrl")
            .populate("doctor", "name specialty")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            consultations
        });
    } catch (err) {
        console.error("❌ Get consults error:", err);
        next(err);
    }
};

const getDoctorPrescriptions = async (req, res, next) => {
    try {
        console.log("📝 Fetching prescriptions for doctor:", req.user.id);

        const prescriptions = await Prescription.find({ doctor: req.user.id })
            .populate("patient", "name email phone age profilePicUrl")
            .populate("consultation")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            prescriptions
        });
    } catch (err) {
        console.error("❌ Get prescriptions error:", err);
        next(err);
    }
};

const getDoctorDashboard = async (req, res, next) => {
    try {
        const doctorId = req.user.id;
        console.log("📊 Dashboard stats for:", doctorId);

        const consultations = await Consultation.find({ doctor: doctorId });
        const prescriptions = await Prescription.find({ doctor: doctorId });
        
        const patientIds = consultations.map(c => c.patient.toString());
        const uniquePatients = [...new Set(patientIds)];

        const stats = {
            totalConsultations: consultations.length,
            totalPrescriptions: prescriptions.length,
            totalPatients: uniquePatients.length,
            pendingConsultations: consultations.filter(c => c.status === "pending").length,
            prescribedConsultations: consultations.filter(c => c.status === "prescribed").length
        };

        console.log("📊 Stats:", stats);

        return res.status(200).json({
            success: true,
            stats
        });
    } catch (err) {
        console.error("❌ Dashboard error:", err);
        next(err);
    }
};

module.exports = {
    signupDoctor,
    loginDoctor,
    getDoctorProfile,
    updateDoctorProfile,
    getDoctors,
    getDoctorById,
    getDoctorConsultations,
    getDoctorPrescriptions,
    getDoctorDashboard
};