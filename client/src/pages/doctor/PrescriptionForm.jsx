import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Navbar from "../../components/Navbar";
import IllnessPanel from "../../components/IllnessPanel";

import { getConsultationById } from "../../services/consultationService";
import {
    createPrescription,
    updatePrescription,
    sendPrescription,
    downloadPrescriptionPdf,
    getPrescriptionByConsultation,
} from "../../services/prescriptionService";

import "../../styles/doctor.css";

const PrescriptionForm = () => {
    const { consultationId } = useParams();
    const navigate = useNavigate();

    const [consult, setConsult] = useState(null);
    const [prescrip, setPrescrip] = useState(null);
    const [form, setForm] = useState({
        careToBeTaken: "",
        medicines: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setErrMsg("");

                if (!consultationId) {
                    const msg = "Consultation ID is missing.";
                    setErrMsg(msg);
                    toast.error(msg);
                    return;
                }

                const res = await getConsultationById(consultationId);
                console.log("Consultation data:", res);

                if (!res?.success) {
                    throw new Error(res?.message || "Unable to load consultation.");
                }

                setConsult(res.consultation);

                if (res.prescription?._id) {
                    setPrescrip(res.prescription);
                    setForm({
                        careToBeTaken: res.prescription.careToBeTaken || "",
                        medicines: res.prescription.medicines || "",
                    });
                } else {
                    try {
                        const presRes = await getPrescriptionByConsultation(consultationId);
                        if (presRes) {
                            setPrescrip(presRes);
                            setForm({
                                careToBeTaken: presRes.careToBeTaken || "",
                                medicines: presRes.medicines || "",
                            });
                        }
                    } catch (err) {
                        console.log("No existing prescription found");
                    }
                }
            } catch (err) {
                console.error("Fetch error:", err);
                const msg = err.response?.data?.message || err.message || "Unable to load consultation.";
                setErrMsg(msg);
                toast.error(msg);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [consultationId]);

    const onFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submitPrescription = async (e) => {
        e.preventDefault();
        setErrMsg("");
        setSuccessMsg("");

        const care = form.careToBeTaken.trim();
        const meds = form.medicines.trim();

        if (!care) {
            const msg = "Care to be Taken is required.";
            setErrMsg(msg);
            toast.error(msg);
            return;
        }

        if (!consultationId) {
            const msg = "Consultation ID is missing.";
            setErrMsg(msg);
            toast.error(msg);
            return;
        }

        setIsSaving(true);

        try {
            let res;
            const payload = { careToBeTaken: care, medicines: meds };

            if (prescrip?._id) {
                res = await updatePrescription(prescrip._id, payload);
            } else {
                res = await createPrescription({
                    consultation: consultationId,
                    careToBeTaken: care,
                    medicines: meds,
                });
            }

            if (!res?.prescription) {
                throw new Error(res?.message || "Prescription response is invalid.");
            }

            setPrescrip(res.prescription);
            setForm({
                careToBeTaken: res.prescription.careToBeTaken || "",
                medicines: res.prescription.medicines || "",
            });

            const msg = prescrip ? "Prescription updated successfully!" : "Prescription created successfully!";
            setSuccessMsg(msg);
            toast.success(msg);
            setShowPreview(true);
        } catch (err) {
            console.error("Save error:", err);

            if (err.response?.status === 409) {
                const msg = "A prescription already exists. Please refresh and edit.";
                setErrMsg(msg);
                toast.error(msg);
                
                try {
                    const existing = await getPrescriptionByConsultation(consultationId);
                    if (existing) {
                        setPrescrip(existing);
                        setForm({
                            careToBeTaken: existing.careToBeTaken || "",
                            medicines: existing.medicines || "",
                        });
                        toast.info("Loaded existing prescription.");
                    }
                } catch (fetchErr) {
                    console.error("Could not fetch existing:", fetchErr);
                }
            } else {
                const msg = err.response?.data?.message || err.message || "Unable to save prescription.";
                setErrMsg(msg);
                toast.error(msg);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleSend = async () => {
        if (!prescrip?._id) {
            toast.error("No prescription to send.");
            return;
        }

        setIsSending(true);
        setErrMsg("");
        setSuccessMsg("");

        try {
            const res = await sendPrescription(prescrip._id);
            console.log("Send response:", res);
            const msg = res?.message || "Prescription sent to patient!";
            setSuccessMsg(msg);
            toast.success(msg);
            setPrescrip(prev => ({ ...prev, sentToPatient: true }));
        } catch (err) {
            console.error("Send error:", err);
            const msg = err.response?.data?.message || err.message || "Failed to send prescription.";
            setErrMsg(msg);
            toast.error(msg);
        } finally {
            setIsSending(false);
        }
    };

    const handleDownload = async () => {
        if (!prescrip?._id) {
            toast.error("No prescription to download.");
            return;
        }

        setIsDownloading(true);

        try {
            const res = await downloadPrescriptionPdf(prescrip._id);
            
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `prescription-${prescrip._id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("PDF downloaded!");
        } catch (err) {
            console.error("Download error:", err);
            toast.error(err.response?.data?.message || "Failed to download PDF.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="page-loading">Loading consultation...</div>
            </>
        );
    }

    if (!consult) {
        return (
            <>
                <Navbar />
                <div className="page-error">{errMsg || "Consultation not found."}</div>
            </>
        );
    }

    const patient = consult.patient || {};
    const doctor = consult.doctor || {};
    const initial = patient?.name?.charAt(0)?.toUpperCase() || "P";
    const today = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    return (
        <div className="doctor-page">
            <Navbar />

            <main className="doctor-content">
                <div className="profile-header">
                    <div>
                        <p className="page-label">Prescription</p>
                        <h1>Patient Consultation</h1>
                        <p>Review patient information and write a prescription.</p>
                    </div>
                    <button
                        type="button"
                        className="prescription-btn"
                        onClick={() => navigate("/doctor/prescriptions")}
                    >
                        ← Consultations
                    </button>
                </div>

                {errMsg && <div className="doctor-alert error">{errMsg}</div>}
                {successMsg && <div className="doctor-alert success">{successMsg}</div>}

                {/* Patient Information with Doctor Name and Date */}
                <div className="consultation-detail-card">
                    <div className="consultation-detail-header">
                        <div className="patient-large-avatar">
                            {patient?.profilePicUrl ? (
                                <img src={patient.profilePicUrl} alt={patient.name || "Patient"} />
                            ) : (
                                <span>{initial}</span>
                            )}
                        </div>
                        <div>
                            <p>Patient</p>
                            <h2>{patient?.name || "Unknown Patient"}</h2>
                            <span>Age: {patient?.age || "N/A"}</span>
                        </div>
                    </div>

                    <div className="patient-information-grid">
                        <div>
                            <span>Email</span>
                            <strong>{patient?.email || "N/A"}</strong>
                        </div>
                        <div>
                            <span>Phone</span>
                            <strong>{patient?.phone || "N/A"}</strong>
                        </div>
                        <div>
                            <span>Doctor</span>
                            <strong>Dr. {doctor?.name || "N/A"}</strong>
                        </div>
                        <div>
                            <span>Consultation Status</span>
                            <strong>{consult.status}</strong>
                        </div>
                    </div>

                    {/* Date Section */}
                    <div className="doctor-date-section">
                        <div className="date-item">
                            <span>Date</span>
                            <strong>{today}</strong>
                        </div>
                    </div>
                </div>

                <div className="doctor-two-column">
                    <div>
                        <div className="consultation-detail-card">
                            <h3>Consultation Details</h3>
                            <div className="medical-detail">
                                <span>Current Illness</span>
                                <p>{consult.currentIllness || "Not provided"}</p>
                            </div>
                            <div className="medical-detail">
                                <span>Recent Surgery</span>
                                <p>{consult.recentSurgery || "No recent surgery"}</p>
                            </div>
                            <div className="medical-detail">
                                <span>Surgery Time Span</span>
                                <p>{consult.surgeryTimeSpan || "N/A"}</p>
                            </div>
                            <div className="medical-detail">
                                <span>Diabetic</span>
                                <p>{consult.isDiabetic ? "Yes" : "No"}</p>
                            </div>
                            <div className="medical-detail">
                                <span>Allergies</span>
                                <p>{consult.allergies || "No allergies provided"}</p>
                            </div>
                            <div className="medical-detail">
                                <span>Other Information</span>
                                <p>{consult.others || "None"}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <IllnessPanel
                            illnesses={patient?.historyOfIllness || []}
                            title="Patient Medical History"
                        />
                    </div>
                </div>

                {/* Prescription Preview */}
                {showPreview && prescrip && (
                    <div className="prescription-preview-card">
                        <div className="preview-header">
                            <h3>📋 Prescription Preview</h3>
                            <button 
                                className="close-preview"
                                onClick={() => setShowPreview(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="prescription-paper">
                            <div className="prescription-header-paper">
                                <h2>Dr. {doctor?.name || "Lorem Ipsum"}</h2>
                                <p className="prescription-date">Date: {today}</p>
                            </div>
                            <div className="prescription-content-paper">
                                <div className="prescription-section-paper">
                                    <h4>Care to be taken</h4>
                                    <p>{form.careToBeTaken || "No instructions provided."}</p>
                                </div>
                                <div className="prescription-section-paper">
                                    <h4>Medicine</h4>
                                    <p>{form.medicines || "No medicines prescribed."}</p>
                                </div>
                            </div>
                            <div className="prescription-footer-paper">
                                <p className="doctor-signature">Dr. {doctor?.name || "Name of doctor"}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="prescription-form-card">
                    <div className="prescription-form-heading">
                        <div>
                            <p className="page-label">Doctor's Prescription</p>
                            <h2>{prescrip ? "Edit Prescription" : "Write Prescription"}</h2>
                            <p>Care instructions are mandatory.</p>
                        </div>
                        <div className="prescription-form-right">
                            {doctor?.name && (
                                <div className="consulting-doctor">
                                    <span className="doctor-label">Consulting Doctor</span>
                                    <strong className="doctor-name-display">Dr. {doctor.name}</strong>
                                </div>
                            )}
                            {prescrip && (
                                <div className="prescription-actions">
                                    <span className="existing-prescription">Existing Prescription</span>
                                    {prescrip.sentToPatient && (
                                        <span className="sent-badge">✓ Sent to Patient</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <form onSubmit={submitPrescription} className="prescription-form">
                        <div className="consultation-field">
                            <label>
                                Care to be Taken <span>*</span>
                            </label>
                            <textarea
                                name="careToBeTaken"
                                value={form.careToBeTaken}
                                onChange={onFormChange}
                                placeholder="Enter instructions, precautions, diet recommendations, follow-up instructions, etc."
                                rows="7"
                                required
                            />
                        </div>

                        <div className="consultation-field">
                            <label>Medicines</label>
                            <textarea
                                name="medicines"
                                value={form.medicines}
                                onChange={onFormChange}
                                placeholder="Example: Paracetamol 500mg - 1 tablet twice daily after food for 5 days."
                                rows="8"
                            />
                        </div>

                        <div className="prescription-form-actions">
                            <div className="action-left">
                                <button
                                    type="button"
                                    className="back-btn"
                                    onClick={() => navigate("/doctor/prescriptions")}
                                >
                                    ← Cancel
                                </button>
                            </div>
                            <div className="action-right">
                                {prescrip && (
                                    <>
                                        <button
                                            type="button"
                                            className="download-btn"
                                            onClick={handleDownload}
                                            disabled={isDownloading}
                                        >
                                            <span className="btn-icon"></span>
                                            {isDownloading ? "Downloading..." : "Download PDF"}
                                        </button>
                                        <button
                                            type="button"
                                            className="send-btn"
                                            onClick={handleSend}
                                            disabled={isSending || prescrip.sentToPatient}
                                        >
                                            <span className="btn-icon"></span>
                                            {isSending ? "Sending..." : "Send to Patient"}
                                        </button>
                                    </>
                                )}
                                <button
                                    type="submit"
                                    className="next-btn"
                                    disabled={isSaving}
                                >
                                    <span className="btn-icon"></span>
                                    {isSaving ? "Saving..." : prescrip ? "Update" : "Save"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default PrescriptionForm;