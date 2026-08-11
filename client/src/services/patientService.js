import api from "./api";

const getPatientProfile = async () => {
    const res = await api.get("/patient/me");
    return res.data;
};

const getPatientPrescriptions = async () => {
    const res = await api.get("/patient/prescriptions");
    return res.data;
};

export {
    getPatientProfile,
    getPatientPrescriptions
};