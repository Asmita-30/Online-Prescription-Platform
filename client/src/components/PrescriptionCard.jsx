const PrescriptionCard = ({ prescription, onDownload, onSend }) => {
    const createdDate = prescription?.createdAt
        ? new Date(prescription.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
        : "N/A";

    const doc = prescription?.doctor || {};
    const initial = doc?.name?.charAt(0)?.toUpperCase() || "D";

    return (
        <div className="prescription-card">
            <div className="prescription-header">
                <div className="prescription-doctor">
                    <div className="prescription-avatar">
                        {doc?.profilePicUrl ? (
                            <img src={doc.profilePicUrl} alt={doc.name} />
                        ) : (
                            <span>{initial}</span>
                        )}
                    </div>
                    <div>
                        <span>Prescription by</span>
                        <h3>{doc?.name || "Doctor"}</h3>
                        <p>{doc?.specialty || ""}</p>
                    </div>
                </div>

                <div className="prescription-date">
                    <span>Date</span>
                    <strong>{createdDate}</strong>
                </div>
            </div>

            <div className="prescription-body">
                <div className="prescription-section">
                    <h4>Care to be Taken</h4>
                    <p>{prescription?.careToBeTaken || "No instructions provided."}</p>
                </div>

                <div className="prescription-section">
                    <h4>Medicines</h4>
                    {prescription?.medicines ? (
                        <p className="medicine-text">{prescription.medicines}</p>
                    ) : (
                        <p>No medicines prescribed.</p>
                    )}
                </div>
            </div>

            <div className="prescription-footer">
                {prescription?.sentToPatient && (
                    <span className="sent-badge">✓ Sent to Patient</span>
                )}

                <div className="prescription-actions">
                    {onDownload && (
                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => onDownload(prescription)}
                        >
                            Download PDF
                        </button>
                    )}
                    {onSend && (
                        <button
                            type="button"
                            className="primary-small-btn"
                            onClick={() => onSend(prescription)}
                        >
                            Send to Patient
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrescriptionCard;