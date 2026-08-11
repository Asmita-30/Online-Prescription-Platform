import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import ConsultationCard from "../../components/ConsultationCard";

import {
    getDoctorConsultations
} from "../../services/consultationService";

import "../../styles/doctor.css";

const DoctorConsultations = () => {
    const navigate = useNavigate();

    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getData = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await getDoctorConsultations();
            const data = res?.consultations ?? [];
            
            setConsultations(data);
        } catch (err) {
            const msg = err.response?.data?.message || "Unable to load consultations.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    let pending = 0;
    let prescribed = 0;
    
    consultations.forEach(item => {
        if (item.status === "pending") pending++;
        if (item.status === "prescribed") prescribed++;
    });

    const total = consultations.length;

    const renderStats = () => (
        <div className="dashboard-stats">
            <div className="stat-card">
                <div className="stat-icon">+</div>
                <div>
                    <span>Total Consultations</span>
                    <strong>{total}</strong>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">!</div>
                <div>
                    <span>Pending</span>
                    <strong>{pending}</strong>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">✓</div>
                <div>
                    <span>Prescribed</span>
                    <strong>{prescribed}</strong>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) {
            return <div className="page-loading">Loading consultations...</div>;
        }
        
        if (error) {
            return <div className="page-error">{error}</div>;
        }
        
        if (consultations.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-icon">+</div>
                    <h3>No consultations yet</h3>
                    <p>Patient consultations will appear here.</p>
                </div>
            );
        }
        
        return (
            <div className="consultations-list">
                {consultations.map((item) => (
                    <ConsultationCard
                        key={item._id}
                        consultation={item}
                        showPatient={true}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="doctor-page">
            <Navbar />
            <main className="doctor-content">
                <div className="profile-header">
                    <div>
                        <p className="page-label">Doctor Dashboard</p>
                        <h1>Patient Consultations</h1>
                        <p>Review patient information and create prescriptions.</p>
                    </div>
                    <button
                        type="button"
                        className="prescription-btn"
                        onClick={() => navigate("/doctor/profile")}
                    >
                        ← Profile
                    </button>
                </div>

                {renderStats()}

                <div className="consultations-section">
                    <div className="section-heading">
                        <div>
                            <h2>Recent Consultations</h2>
                            <p>Newest consultations appear first.</p>
                        </div>
                        <button
                            type="button"
                            className="refresh-btn"
                            onClick={getData}
                        >
                            ↻ Refresh
                        </button>
                    </div>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default DoctorConsultations;