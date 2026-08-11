import { useNavigate } from "react-router-dom";

const ConsultationCard = ({ consultation, showPatient = true }) => {
    const navigate = useNavigate();

    const patient = consultation?.patient || {};
    const doctor = consultation?.doctor || {};
    const isPrescribed = consultation?.status === "prescribed";

    const date = consultation?.createdAt
        ? new Date(consultation.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
        : "N/A";

    const personName = showPatient ? patient?.name || "Unknown Patient" : doctor?.name || "Unknown Doctor";
    const personDetail = showPatient ? `Age: ${patient?.age || "N/A"}` : doctor?.specialty || "Doctor";
    const personInitial = showPatient 
        ? patient?.name?.charAt(0)?.toUpperCase() 
        : doctor?.name?.charAt(0)?.toUpperCase();

    const handleView = () => {
        navigate(`/doctor/prescriptions/${consultation._id}`);
    };

    return (
        <div className="consultation-card">
            <div className="consultation-card-top">
                <div className="consultation-person">
                    <div className="consultation-avatar">
                        {personInitial}
                    </div>
                    <div>
                        <h3>{personName}</h3>
                        <p>{personDetail}</p>
                    </div>
                </div>

                <span className={`consultation-status ${isPrescribed ? "prescribed" : "pending"}`}>
                    {isPrescribed ? "Prescribed" : "Pending"}
                </span>
            </div>

            <div className="consultation-details">
                <div className="consultation-detail">
                    <span>Current Illness</span>
                    <strong>{consultation?.currentIllness || "Not provided"}</strong>
                </div>
                <div className="consultation-detail">
                    <span>Submitted</span>
                    <strong>{date}</strong>
                </div>
            </div>

            <div className="consultation-card-bottom">
                <button type="button" className="view-consultation-btn" onClick={handleView}>
                    {isPrescribed ? "View Prescription" : "View Consultation"}
                </button>
            </div>
        </div>
    );
};

export default ConsultationCard;