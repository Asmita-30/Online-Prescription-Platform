import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    signupPatient,
    loginPatient
} from "../../services/authService";

import { useAuth } from "../../context/AuthContext";

import "../../styles/auth.css";

const PatientAuth = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [tab, setTab] = useState("login");

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        age: "",
        historyOfSurgery: "",
        historyOfIllness: "",
        profilePic: null
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const onLoginChange = (e) => {
        setLoginData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const onSignupChange = (e) => {
        const { name, value, files } = e.target;
        setSignupData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const submitLogin = async (e) => {
        e.preventDefault();
        setErrMsg("");
        setIsLoading(true);

        try {
            const res = await loginPatient(loginData);
            login(res);
            navigate("/patient/doctors");
        } catch (err) {
            const msg = err.response?.data?.message || "Patient login failed";
            setErrMsg(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const submitSignup = async (e) => {
        e.preventDefault();
        setErrMsg("");
        setIsLoading(true);

        try {
            const fd = new FormData();
            const fields = ["name", "email", "phone", "password", "age", "historyOfSurgery", "historyOfIllness"];
            
            fields.forEach(field => {
                fd.append(field, signupData[field]);
            });

            if (signupData.profilePic) {
                fd.append("profilePic", signupData.profilePic);
            }

            const res = await signupPatient(fd);
            login(res);
            navigate("/patient/doctors");
        } catch (err) {
            const msg = err.response?.data?.message || "Patient registration failed";
            setErrMsg(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const switchTab = (newTab) => {
        setTab(newTab);
        setErrMsg("");
    };

    const renderLoginForm = () => (
        <form className="auth-form" onSubmit={submitLogin}>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    type="email"
                    name="email"
                    placeholder="patient@12345.com"
                    value={loginData.email}
                    onChange={onLoginChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={onLoginChange}
                    required
                />
            </div>
            <button className="primary-btn" type="submit" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In as Patient"}
            </button>
        </form>
    );

    const renderSignupForm = () => (
        <form className="auth-form" onSubmit={submitSignup}>
            <div className="form-row">
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Asmita Bhadane"
                        value={signupData.name}
                        onChange={onSignupChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Age</label>
                    <input
                        type="number"
                        name="age"
                        min="1"
                        max="120"
                        placeholder="25"
                        value={signupData.age}
                        onChange={onSignupChange}
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="patient@12345.com"
                        value={signupData.email}
                        onChange={onSignupChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="9876543210"
                        value={signupData.phone}
                        onChange={onSignupChange}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={signupData.password}
                    onChange={onSignupChange}
                    minLength="6"
                    required
                />
            </div>

            <div className="form-group">
                <label>History of Surgery</label>
                <textarea
                    name="historyOfSurgery"
                    placeholder="Describe previous surgeries, if any"
                    value={signupData.historyOfSurgery}
                    onChange={onSignupChange}
                    rows="3"
                />
            </div>

            <div className="form-group">
                <label>History of Illness</label>
                <input
                    type="text"
                    name="historyOfIllness"
                    placeholder="Diabetes, Asthma, Fever"
                    value={signupData.historyOfIllness}
                    onChange={onSignupChange}
                />
                <small>Separate multiple illnesses with commas.</small>
            </div>

            <div className="form-group">
                <label>Profile Picture</label>
                <input
                    type="file"
                    name="profilePic"
                    accept="image/*"
                    onChange={onSignupChange}
                />
            </div>

            <button className="primary-btn" type="submit" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Patient Account"}
            </button>
        </form>
    );

    return (
        <div className="auth-page patient-theme">
            <div className="auth-container">
                <div className="auth-brand">
                    <div className="brand-icon">+</div>
                    <h1>Medi<span>Care</span></h1>
                    <p>Your health, our priority</p>
                </div>

                <div className="auth-card">
                    <div className="auth-header">
                        <h2>Patient Portal</h2>
                        <p>Manage your healthcare securely</p>
                    </div>

                    <div className="auth-tabs">
                        <button
                            type="button"
                            className={tab === "login" ? "active" : ""}
                            onClick={() => switchTab("login")}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            className={tab === "signup" ? "active" : ""}
                            onClick={() => switchTab("signup")}
                        >
                            Create Account
                        </button>
                    </div>

                    {errMsg && <div className="alert error">{errMsg}</div>}

                    {tab === "login" ? renderLoginForm() : renderSignupForm()}
                </div>

                <button className="switch-role" onClick={() => navigate("/doctor")}>
                    Are you a doctor? <strong>Doctor Portal →</strong>
                </button>
            </div>
        </div>
    );
};

export default PatientAuth;