import api from "./api";

export const createConsultation = async (data) => {
    try {
        console.log("📤 Creating consultation:", data);
        const res = await api.post("/consultations", data);
        console.log("📥 Consultation created:", res.data);
        return res.data;
    } catch (err) {
        console.error("❌ Create failed:", err);
        console.error("Response:", err.response?.data);
        throw err;
    }
};

export const getConsultationById = async (id) => {
    try {
        const res = await api.get(`/consultations/${id}`);
        return res.data;
    } catch (err) {
        console.error("❌ Fetch failed:", err);
        throw err;
    }
};

export const getPatientConsultations = async () => {
    try {
        const res = await api.get("/consultations/patient");
        return res.data;
    } catch (err) {
        console.error("❌ Fetch patient consults failed:", err);
        throw err;
    }
};

export const getDoctorConsultations = async () => {
    try {
        const res = await api.get("/doctor/consultations");
        return res.data;
    } catch (err) {
        console.error("❌ Fetch doctor consults failed:", err);
        throw err;
    }
};