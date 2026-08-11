import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
    const navigate = useNavigate();

    const handleConsult = () => {
        navigate(`/patient/consult/${doctor._id}`);
    };

    const initial = doctor?.name?.charAt(0)?.toUpperCase() || "D";
    const experience = doctor?.yearsExperience || 0;

    return (
        <div className="doctor-card">
            <div className="doctor-card-image">
                {doctor?.profilePicUrl ? (
                    <img src={doctor.profilePicUrl} alt={doctor.name} />
                ) : (
                    <div className="doctor-card-placeholder">{initial}</div>
                )}
            </div>

            <div className="doctor-card-body">
                <div className="doctor-card-header">
                    <h2>{doctor?.name}</h2>
                    <span className="doctor-status">Available</span>
                </div>

                <p className="doctor-specialty">{doctor?.specialty}</p>

                <div className="doctor-card-info">
                    <div>
                        <span>Experience</span>
                        <strong>{experience} years</strong>
                    </div>
                </div>

                <button type="button" className="consult-btn" onClick={handleConsult}>
                    Consult Doctor <span>→</span>
                </button>
            </div>
        </div>
    );
};

export default DoctorCard;