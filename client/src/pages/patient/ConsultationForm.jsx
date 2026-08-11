import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import Navbar from "../../components/Navbar";
import ConsultationStepper from "../../components/ConsultationStepper";
import IllnessPanel from "../../components/IllnessPanel";

import { getDoctorById } from "../../services/doctorService";
import { createConsultation } from "../../services/consultationService";

import { useAuth } from "../../context/AuthContext";

import QRImage from "../../assets/QR.png";

import "../../styles/consultation.css";

const ConsultationForm = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [doc, setDoc] = useState(null);
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showPayment, setShowPayment] = useState(false);
    const [consentAccepted, setConsentAccepted] = useState(false);

    const [form, setForm] = useState({
        currentIllness: "",
        recentSurgery: "",
        surgeryTimeSpan: "",
        isDiabetic: null,
        allergies: "",
        others: "",
        transactionId: "",
    });

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await getDoctorById(doctorId);
                setDoc(res.doctor);
            } catch (err) {
                const msg = err.response?.data?.message || "Unable to load doctor";
                setErrMsg(msg);
                toast.error(msg);
            } finally {
                setIsLoading(false);
            }
        };

        if (doctorId) {
            fetchDoctor();
        }
    }, [doctorId]);

    const onFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const onDiabetesChange = (val) => {
        setForm(prev => ({ ...prev, isDiabetic: val }));
    };

    const validateStep = () => {
        setErrMsg("");

        if (step === 1) {
            if (!form.currentIllness.trim()) {
                const msg = "Please describe your current illness.";
                setErrMsg(msg);
                toast.error(msg);
                return false;
            }
            return true;
        }

        if (step === 2) {
            if (form.isDiabetic === null) {
                const msg = "Please select whether you have diabetes.";
                setErrMsg(msg);
                toast.error(msg);
                return false;
            }
            return true;
        }

        if (step === 3) {
            if (!form.transactionId.trim()) {
                const msg = "Transaction ID is required.";
                setErrMsg(msg);
                toast.error(msg);
                return false;
            }
            if (!consentAccepted) {
                const msg = "Please accept the consent for online consultation.";
                setErrMsg(msg);
                toast.error(msg);
                return false;
            }
            return true;
        }

        return true;
    };

    const goNext = () => {
        if (!validateStep()) return;
        setStep(prev => Math.min(prev + 1, 3));
    };

    const goBack = () => {
        setErrMsg("");
        setStep(prev => Math.max(prev - 1, 1));
    };

    const submitForm = async (e) => {
        e.preventDefault();

        if (!validateStep()) return;

        if (!doctorId) {
            const msg = "Doctor ID is missing. Please try again.";
            setErrMsg(msg);
            toast.error(msg);
            return;
        }

        if (!form.transactionId.trim()) {
            const msg = "Transaction ID is required.";
            setErrMsg(msg);
            toast.error(msg);
            return;
        }

        if (!form.currentIllness.trim()) {
            const msg = "Current Illness is required.";
            setErrMsg(msg);
            toast.error(msg);
            return;
        }

        if (!consentAccepted) {
            const msg = "Please accept the consent for online consultation.";
            setErrMsg(msg);
            toast.error(msg);
            return;
        }

        setIsSubmitting(true);
        setErrMsg("");
        setSuccessMsg("");

        try {
            const payload = {
                doctorId: doctorId,
                currentIllness: form.currentIllness.trim(),
                recentSurgery: form.recentSurgery.trim() || "",
                surgeryTimeSpan: form.surgeryTimeSpan.trim() || "",
                isDiabetic: form.isDiabetic || false,
                allergies: form.allergies.trim() || "",
                others: form.others.trim() || "",
                transactionId: form.transactionId.trim(),
                consentAccepted: consentAccepted,
            };

            console.log("Submitting:", payload);

            const res = await createConsultation(payload);
            console.log("Response:", res);

            setShowPayment(true);

            setTimeout(() => {
                setShowPayment(false);
                navigate("/patient/doctors");
            }, 4000);

        } catch (err) {
            console.error(" Error:", err);
            const msg = err.response?.data?.message || "Unable to submit consultation.";
            setErrMsg(msg);
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderPaymentOverlay = () => (
        <div className="payment-success-overlay">
            <div className="payment-success-modal">
                <div className="success-icon">✅</div>
                <h2>Payment Successful!</h2>
                <p>Your consultation has been submitted successfully.</p>
                <div className="payment-details">
                    <p><strong>Transaction ID:</strong> {form.transactionId}</p>
                    <p><strong>Amount Paid:</strong> ₹499</p>
                    <p><strong>Doctor:</strong> Dr. {doc.name}</p>
                </div>
                <div className="loading-spinner">
                    <span>Redirecting to doctors list...</span>
                </div>
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div className="consultation-step">
            <div className="step-heading">
                <span>Step 1</span>
                <h2>Tell us about your health</h2>
                <p>Provide information about your current condition and recent surgery.</p>
            </div>

            <IllnessPanel illnesses={user?.historyOfIllness || []} />

            <div className="consultation-field">
                <label>Current Illness <span>*</span></label>
                <textarea
                    name="currentIllness"
                    value={form.currentIllness}
                    onChange={onFormChange}
                    placeholder="Describe your current illness, symptoms, and how you are feeling..."
                    rows="5"
                    required
                />
            </div>

            <div className="consultation-field">
                <label>Have you had any recent surgery?</label>
                <textarea
                    name="recentSurgery"
                    value={form.recentSurgery}
                    onChange={onFormChange}
                    placeholder="Describe any recent surgery, if applicable."
                    rows="3"
                />
            </div>

            <div className="consultation-field">
                <label>Surgery Time Span</label>
                <input
                    type="text"
                    name="surgeryTimeSpan"
                    value={form.surgeryTimeSpan}
                    onChange={onFormChange}
                    placeholder="Example: 3 months ago"
                />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="consultation-step">
            <div className="step-heading">
                <span>Step 2</span>
                <h2>Medical History</h2>
                <p>Help the doctor understand your medical background.</p>
            </div>

            <div className="consultation-field">
                <label>Are you diabetic? <span>*</span></label>
                <div className="radio-group">
                    <label className={form.isDiabetic === true ? "radio-option selected" : "radio-option"}>
                        <input
                            type="radio"
                            name="isDiabetic"
                            checked={form.isDiabetic === true}
                            onChange={() => onDiabetesChange(true)}
                        />
                        <span>Yes</span>
                    </label>
                    <label className={form.isDiabetic === false ? "radio-option selected" : "radio-option"}>
                        <input
                            type="radio"
                            name="isDiabetic"
                            checked={form.isDiabetic === false}
                            onChange={() => onDiabetesChange(false)}
                        />
                        <span>No</span>
                    </label>
                </div>
            </div>

            <div className="consultation-field">
                <label>Allergies</label>
                <textarea
                    name="allergies"
                    value={form.allergies}
                    onChange={onFormChange}
                    placeholder="List any known medicine, food, or other allergies."
                    rows="4"
                />
            </div>

            <div className="consultation-field">
                <label>Other Medical Information</label>
                <textarea
                    name="others"
                    value={form.others}
                    onChange={onFormChange}
                    placeholder="Anything else your doctor should know?"
                    rows="4"
                />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="consultation-step">
            <div className="step-heading">
                <span>Step 3</span>
                <h2>Complete Payment</h2>
                <p>Scan the QR code below to make the payment.</p>
            </div>

            <div className="payment-box">
                <div className="qr-container">
                    <img 
                        src={QRImage} 
                        alt="Payment QR Code" 
                        className="qr-code-image"
                    />
                </div>
                
                <h3>Scan & Pay</h3>
                <p>Scan the QR code using any UPI application</p>
                <div className="payment-amount">
                    <span>Amount:</span>
                    <strong>₹499</strong>
                </div>
                <div className="payment-upi">
                    <span>UPI ID:</span>
                    <strong>doctor@upi</strong>
                </div>
            </div>

            <div className="consultation-field">
                <label>Transaction ID <span>*</span></label>
                <input
                    type="text"
                    name="transactionId"
                    value={form.transactionId}
                    onChange={onFormChange}
                    placeholder="Enter your payment transaction ID"
                    required
                />
                <small>Enter the transaction ID after successful payment</small>
            </div>

            {/* Consent Section */}
            <div className="consent-normal">
                <h3 className="consent-title">CONSENT FOR ONLINE CONSULTATION</h3>
                
                <p className="consent-text-normal">
                    I HAVE UNDERSTOOD THAT THIS IS AN ONLINE CONSULTATION WITHOUT A 
                    PHYSICAL CHECKUP OF MY SYMPTOMS. THE DOCTOR HENCE RELIES ON MY 
                    DESCRIPTION OF THE PROBLEM OR SCANNED REPORTS PROVIDED BY ME. 
                    WITH THIS UNDERSTANDING, I HEREBY GIVE MY CONSENT FOR ONLINE 
                    CONSULTATION.
                </p>

                <label className="consent-checkbox-normal">
                    <input
                        type="checkbox"
                        checked={consentAccepted}
                        onChange={(e) => setConsentAccepted(e.target.checked)}
                    />
                    <span>Yes, I Accept</span>
                </label>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="page-loading">Loading doctor...</div>
            </>
        );
    }

    if (!doc) {
        return (
            <>
                <Navbar />
                <div className="page-error">{errMsg || "Doctor not found."}</div>
            </>
        );
    }

    const initial = doc.name?.charAt(0)?.toUpperCase();

    return (
        <div className="consultation-page">
            <Navbar />

            {showPayment && renderPaymentOverlay()}

            <main className="consultation-container">
                <div className="consultation-header">
                    <div>
                        <p className="page-label">Online Consultation</p>
                        <h1>Consult Dr. {doc.name}</h1>
                        <p>Complete the following information to submit your consultation.</p>
                    </div>

                    <div className="selected-doctor">
                        {doc.profilePicUrl ? (
                            <img src={doc.profilePicUrl} alt={doc.name} />
                        ) : (
                            <div>{initial}</div>
                        )}
                        <section>
                            <strong>{doc.name}</strong>
                            <span>{doc.specialty}</span>
                        </section>
                    </div>
                </div>

                <ConsultationStepper 
                    currentStep={step} 
                    onStepClick={(clickedStep) => {
                        if (clickedStep < step) {
                            setErrMsg("");
                            setStep(clickedStep);
                        }
                    }} 
                />

                {errMsg && <div className="consultation-alert error">{errMsg}</div>}
                {successMsg && <div className="consultation-alert success">{successMsg}</div>}

                <form className="consultation-form-card" onSubmit={submitForm}>
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}

                    <div className="consultation-actions">
                        {step > 1 && (
                            <button type="button" className="back-btn" onClick={goBack}>
                                ← Back
                            </button>
                        )}

                        <div />

                        {step < 3 ? (
                            <button type="button" className="next-btn" onClick={goNext}>
                                Continue →
                            </button>
                        ) : (
                            <button type="submit" className="next-btn" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit Consultation"}
                            </button>
                        )}
                    </div>
                </form>
            </main>
        </div>
    );
};

export default ConsultationForm;