import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import { getDoctors } from "../../services/doctorService";

import "../../styles/patient.css";

const DoctorsList = () => {
    const navigate = useNavigate();

    const [docs, setDocs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const res = await getDoctors();
                setDocs(res.doctors);
            } catch (err) {
                const msg = err.response?.data?.message || "Unable to load doctors";
                setErrMsg(msg);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocs();
    }, []);

    const renderDoctorCard = (doc) => {
        const initial = doc.name?.charAt(0)?.toUpperCase() || "D";
        
        return (
            <div className="doctor-card" key={doc._id}>
                <div className="doctor-card-image">
                    {doc.profilePicUrl ? (
                        <img src={doc.profilePicUrl} alt={doc.name} />
                    ) : (
                        <div className="doctor-card-placeholder">
                            {initial}
                        </div>
                    )}
                </div>

                <div className="doctor-card-body">
                    <h2>{doc.name}</h2>
                    <p className="doctor-specialty">{doc.specialty}</p>
                    <div className="doctor-experience">
                        <span>Experience</span>
                        <strong>{doc.yearsExperience} years</strong>
                    </div>
                    <button
                        className="consult-btn"
                        onClick={() => navigate(`/patient/consult/${doc._id}`)}
                    >
                        Consult Doctor <span>→</span>
                    </button>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="page-loading">Loading doctors...</div>;
        }

        if (errMsg) {
            return <div className="page-error">{errMsg}</div>;
        }

        if (docs.length === 0) {
            return (
                <div className="empty-state">
                    <h3>No doctors available</h3>
                    <p>Please check again later.</p>
                </div>
            );
        }

        return (
            <div className="doctors-grid">
                {docs.map((doc) => renderDoctorCard(doc))}
            </div>
        );
    };

    return (
        <div className="patient-page">
            <Navbar />

            <main className="patient-content">
                <div className="patient-page-header">
                    <div>
                        <p className="page-label">Healthcare Professionals</p>
                        <h1>Find Your Doctor</h1>
                        <p>Choose a qualified doctor for your consultation.</p>
                    </div>
                </div>

                {renderContent()}
            </main>
        </div>
    );
};

export default DoctorsList;