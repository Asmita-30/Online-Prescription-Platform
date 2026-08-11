import api from "./api";

const signupDoctor = async (formData) => {
    const res = await api.post("/doctor/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};

const loginDoctor = async (credentials) => {
    const res = await api.post("/doctor/login", credentials);
    return res.data;
};

const signupPatient = async (formData) => {
    const res = await api.post("/patient/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};

const loginPatient = async (credentials) => {
    const res = await api.post("/patient/login", credentials);
    return res.data;
};

export {
    signupDoctor,
    loginDoctor,
    signupPatient,
    loginPatient
};