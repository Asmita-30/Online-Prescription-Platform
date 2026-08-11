import api from "./api";

// Doctor Auth
export const doctorSignup = async (formData) => {
    try {
        const res = await api.post("/doctor/signup", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    } catch (err) {
        console.error(" Signup failed:", err);
        throw err;
    }
};

export const doctorLogin = async (data) => {
    try {
        const res = await api.post("/doctor/login", data);
        return res.data;
    } catch (err) {
        console.error(" Login failed:", err);
        throw err;
    }
};

// Doctor Profile
export const getDoctorProfile = async () => {
    try {
        const res = await api.get("/doctor/me");
        return res.data;
    } catch (err) {
        console.error(" Fetch profile failed:", err);
        throw err;
    }
};

export const updateDoctorProfile = async (data) => {
    try {
        const res = await api.put("/doctor/me", data);
        return res.data;
    } catch (err) {
        console.error(" Update failed:", err);
        throw err;
    }
};

// Doctor Dashboard
export const getDoctorDashboard = async () => {
    try {
        const res = await api.get("/doctor/dashboard");
        return res.data;
    } catch (err) {
        console.error(" Dashboard failed:", err);
        throw err;
    }
};

// Doctors Directory
export const getDoctors = async () => {
    try {
        const res = await api.get("/doctors");
        return res.data;
    } catch (err) {
        console.error(" Fetch doctors failed:", err);
        throw err;
    }
};

export const getDoctorById = async (doctorId) => {
    try {
        const res = await api.get(`/doctors/${doctorId}`);
        return res.data;
    } catch (err) {
        console.error(" Fetch doctor failed:", err);
        throw err;
    }
};

// Doctor Consultations
export const getDoctorConsultations = async () => {
    try {
        const res = await api.get("/doctor/consultations");
        return res.data;
    } catch (err) {
        console.error(" Fetch consults failed:", err);
        throw err;
    }
};

// Doctor Prescriptions
export const getDoctorPrescriptions = async () => {
    try {
        const res = await api.get("/doctor/prescriptions");
        return res.data;
    } catch (err) {
        console.error(" Fetch prescriptions failed:", err);
        throw err;
    }
};