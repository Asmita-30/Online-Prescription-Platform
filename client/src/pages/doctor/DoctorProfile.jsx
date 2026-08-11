import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import Navbar from "../../components/Navbar";
import { getDoctorProfile, getDoctorDashboard } from "../../services/doctorService";

import "../../styles/doctor.css";

const DoctorProfile = () => {
    const navigate = useNavigate();

    const [doc, setDoc] = useState(null);
    const [stats, setStats] = useState({
        totalConsultations: 0,
        totalPrescriptions: 0,
        totalPatients: 0,
        pendingConsultations: 0,
        prescribedConsultations: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setErrMsg("");

                const profileRes = await getDoctorProfile();
                setDoc(profileRes.doctor);

                try {
                    const statsRes = await getDoctorDashboard();
                    if (statsRes.success) {
                        setStats(statsRes.stats);
                    }
                } catch (statsErr) {
                    console.warn("Stats not available:", statsErr);
                }
            } catch (err) {
                const msg = err.response?.data?.message || "Unable to load profile";
                setErrMsg(msg);
                toast.error(msg);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderLoading = () => (
        <>
            <Navbar />
            <div className="page-loading">Loading doctor profile...</div>
        </>
    );

    const renderError = (msg) => (
        <>
            <Navbar />
            <div className="page-error">{msg}</div>
        </>
    );

    const renderStats = () => (
        <div className="dashboard-stats">
            <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div>
                    <span>Total Consultations</span>
                    <strong>{stats.totalConsultations}</strong>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">💊</div>
                <div>
                    <span>Prescriptions</span>
                    <strong>{stats.totalPrescriptions}</strong>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">👤</div>
                <div>
                    <span>Total Patients</span>
                    <strong>{stats.totalPatients}</strong>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div>
                    <span>Pending Consultations</span>
                    <strong>{stats.pendingConsultations}</strong>
                </div>
            </div>
        </div>
    );

    const renderProfileCard = () => {
        const initial = doc?.name?.charAt(0)?.toUpperCase() || "D";
        
        return (
            <div className="doctor-profile-card">
                <div className="doctor-photo-section">
                    {doc.profilePicUrl ? (
                        <img
                            src={doc.profilePicUrl}
                            alt={doc.name}
                            className="doctor-profile-photo"
                        />
                    ) : (
                        <div className="doctor-profile-placeholder">
                            {initial}
                        </div>
                    )}
                    <span className="verified-badge">✓ Verified Doctor</span>
                </div>

                <div className="doctor-details">
                    <h2>Dr. {doc.name}</h2>
                    <p className="specialty">{doc.specialty}</p>

                    <div className="details-grid">
                        <div className="detail-item">
                            <span>Email</span>
                            <strong>{doc.email}</strong>
                        </div>
                        <div className="detail-item">
                            <span>Phone</span>
                            <strong>{doc.phone}</strong>
                        </div>
                        <div className="detail-item">
                            <span>Experience</span>
                            <strong>{doc.yearsExperience} years</strong>
                        </div>
                        <div className="detail-item">
                            <span>Specialty</span>
                            <strong>{doc.specialty}</strong>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderActions = () => (
        <div className="quick-actions-section">
            <h3>Quick Actions</h3>
            <div className="quick-actions-grid">
                <button
                    className="quick-action-btn prescriptions"
                    onClick={() => navigate("/doctor/prescriptions")}
                >
                    <div className="action-icon-wrapper">
                        <span className="action-icon">📋</span>
                    </div>
                    <div className="action-content">
                        <span className="action-title">View Prescriptions</span>
                        <span className="action-subtitle">Manage all prescriptions</span>
                    </div>
                    <span className="action-arrow">→</span>
                </button>
                <button
                    className="quick-action-btn consultations"
                    onClick={() => navigate("/doctor/consultations")}
                >
                    <div className="action-icon-wrapper">
                        <span className="action-icon">👨‍⚕️</span>
                    </div>
                    <div className="action-content">
                        <span className="action-title">View Consultations</span>
                        <span className="action-subtitle">Review patient consultations</span>
                    </div>
                    <span className="action-arrow">→</span>
                </button>
            </div>
        </div>
    );

    if (isLoading) return renderLoading();
    if (errMsg) return renderError(errMsg);
    if (!doc) return renderError("Doctor not found.");

    return (
        <div className="doctor-page">
            <Navbar />

            <main className="doctor-content">
                <div className="profile-header">
                    <div>
                        <p className="page-label">Doctor Dashboard</p>
                        <h1>Welcome, Dr. {doc.name}</h1>
                        <p>Manage your profile and prescriptions.</p>
                    </div>
                    <button
                        className="prescription-btn"
                        onClick={() => navigate("/doctor/prescriptions")}
                    >
                        View Prescriptions →
                    </button>
                </div>

                {renderProfileCard()}
                {renderStats()}
                {renderActions()}
            </main>
        </div>
    );
};

export default DoctorProfile;