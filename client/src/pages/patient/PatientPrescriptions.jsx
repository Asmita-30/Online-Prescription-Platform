import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import PrescriptionCard from "../../components/PrescriptionCard";

import {
    getPatientPrescriptions
} from "../../services/patientService";

import {
    downloadPrescriptionPdf
} from "../../services/prescriptionService";

import "../../styles/patient.css";

const PatientPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");
    const [downloadingId, setDownloadingId] = useState(null);

    const fetchPrescriptions = async () => {
        try {
            setIsLoading(true);
            setErrMsg("");

            const res = await getPatientPrescriptions();
            setPrescriptions(res.prescriptions || []);
        } catch (err) {
            const msg = err.response?.data?.message || "Unable to load prescriptions.";
            setErrMsg(msg);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const downloadPrescription = async (prescription) => {
        try {
            setDownloadingId(prescription._id);

            const blob = await downloadPrescriptionPdf(prescription._id);
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement("a");
            link.href = url;
            link.download = `prescription-${prescription._id}.pdf`;
            
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            window.URL.revokeObjectURL(url);
        } catch (err) {
            const msg = err.response?.data?.message || "Unable to download prescription.";
            setErrMsg(msg);
        } finally {
            setDownloadingId(null);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="page-loading">Loading prescriptions...</div>;
        }

        if (errMsg) {
            return <div className="patient-alert error">{errMsg}</div>;
        }

        if (prescriptions.length === 0) {
            return (
                <div className="patient-empty-state">
                    <div className="empty-icon">+</div>
                    <h3>No prescriptions yet</h3>
                    <p>Once a doctor prescribes medication, it will appear here.</p>
                </div>
            );
        }

        return (
            <div className="prescriptions-list">
                {prescriptions.map((item) => (
                    <PrescriptionCard
                        key={item._id}
                        prescription={item}
                        onDownload={downloadPrescription}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="patient-page">
            <Navbar />

            <main className="patient-content">
                <div className="patient-page-header">
                    <div>
                        <p className="page-label">My Health</p>
                        <h1>My Prescriptions</h1>
                        <p>View and download prescriptions issued by your doctors.</p>
                    </div>
                    <button
                        type="button"
                        className="refresh-btn"
                        onClick={fetchPrescriptions}
                    >
                        ↻ Refresh
                    </button>
                </div>

                {renderContent()}
            </main>
        </div>
    );
};

export default PatientPrescriptions;