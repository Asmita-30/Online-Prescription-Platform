import api from "./api";

export const createPrescription = async (data) => {
    try {
        const res = await api.post("/prescriptions", data);
        return res.data;
    } catch (err) {
        console.error("Create failed:", err);
        throw err;
    }
};

export const updatePrescription = async (id, data) => {
    try {
        const res = await api.put(`/prescriptions/${id}`, data);
        return res.data;
    } catch (err) {
        console.error("Update failed:", err);
        throw err;
    }
};

export const getPrescriptionByConsultation = async (consultationId) => {
    try {
        const res = await api.get("/prescriptions/doctor");
        const prescriptions = res.data.prescriptions || [];
        const found = prescriptions.find(
            (p) => p.consultation?._id === consultationId || p.consultation === consultationId
        );
        return found || null;
    } catch (err) {
        console.error("Fetch by consultation failed:", err);
        return null;
    }
};

export const getPrescription = async (id) => {
    try {
        const res = await api.get(`/prescriptions/${id}`);
        return res.data;
    } catch (err) {
        console.error("Fetch failed:", err);
        throw err;
    }
};

export const sendPrescription = async (id) => {
    try {
        const res = await api.post(`/prescriptions/${id}/send`);
        return res.data;
    } catch (err) {
        console.error("Send failed:", err);
        throw err;
    }
};

export const downloadPrescriptionPdf = async (id) => {
    try {
        const res = await api.get(`/prescriptions/${id}/pdf`, {
            responseType: "blob"
        });
        return res;
    } catch (err) {
        console.error("Download failed:", err);
        throw err;
    }
};

export const getDoctorPrescriptions = async () => {
    try {
        const res = await api.get("/prescriptions/doctor");
        return res.data;
    } catch (err) {
        console.error("Fetch doctor prescriptions failed:", err);
        throw err;
    }
};

export const getPatientPrescriptions = async () => {
    try {
        const res = await api.get("/prescriptions/patient");
        return res.data;
    } catch (err) {
        console.error("Fetch patient prescriptions failed:", err);
        throw err;
    }
};