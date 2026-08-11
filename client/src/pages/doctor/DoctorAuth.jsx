import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    signupDoctor,
    loginDoctor
} from "../../services/authService";

import { useAuth } from "../../context/AuthContext";

import "../../styles/auth.css";

const DoctorAuth = () => {
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
        specialty: "",
        yearsExperience: "",
        profilePic: null
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

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
        setSuccessMsg("");
        setIsLoading(true);

        try {
            const res = await loginDoctor(loginData);
            login(res);
            navigate("/doctor/profile");
        } catch (err) {
            const msg = err.response?.data?.message || "Doctor login failed";
            setErrMsg(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const submitSignup = async (e) => {
        e.preventDefault();
        setErrMsg("");
        setSuccessMsg("");
        setIsLoading(true);

        try {
            const fd = new FormData();
            const fields = ["name", "email", "phone", "password", "specialty", "yearsExperience"];
            
            fields.forEach(field => {
                fd.append(field, signupData[field]);
            });

            if (signupData.profilePic) {
                fd.append("profilePic", signupData.profilePic);
            }

            const res = await signupDoctor(fd);
            login(res);
            navigate("/doctor/profile");
        } catch (err) {
            const msg = err.response?.data?.message || "Doctor registration failed";
            setErrMsg(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const switchTab = (newTab) => {
        setTab(newTab);
        setErrMsg("");
        setSuccessMsg("");
    };

    const renderLoginForm = () => (
        <form className="auth-form" onSubmit={submitLogin}>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    type="email"
                    name="email"
                    placeholder="drasmita@20.com"
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
            <button type="submit" className="primary-btn" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In as Doctor"}
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
                        placeholder="Dr. Asmita"
                        value={signupData.name}
                        onChange={onSignupChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="8080822156"
                        value={signupData.phone}
                        onChange={onSignupChange}
                        required
                    />
                </div>
            </div>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    type="email"
                    name="email"
                    placeholder="drasmita@20.com"
                    value={signupData.email}
                    onChange={onSignupChange}
                    required
                />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Specialty</label>
                    <input
                        type="text"
                        name="specialty"
                        placeholder="Cardiologist"
                        value={signupData.specialty}
                        onChange={onSignupChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Experience</label>
                    <input
                        type="number"
                        name="yearsExperience"
                        min="0"
                        step="0.1"
                        placeholder="5.5"
                        value={signupData.yearsExperience}
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
                <label>Profile Picture</label>
                <input
                    type="file"
                    name="profilePic"
                    accept="image/*"
                    onChange={onSignupChange}
                />
            </div>
            <button type="submit" className="primary-btn" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Doctor Account"}
            </button>
        </form>
    );

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-brand">
                    <div className="brand-icon">+</div>
                    <h1>Medi<span>Care</span></h1>
                    <p>Online Prescription Platform</p>
                </div>

                <div className="auth-card">
                    <div className="auth-header">
                        <h2>Doctor Portal</h2>
                        <p>Access your medical practice dashboard</p>
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
                    {successMsg && <div className="alert success">{successMsg}</div>}

                    {tab === "login" ? renderLoginForm() : renderSignupForm()}
                </div>

                <button className="switch-role" onClick={() => navigate("/patient")}>
                    Are you a patient? <strong>Patient Portal →</strong>
                </button>
            </div>
        </div>
    );
};

export default DoctorAuth;