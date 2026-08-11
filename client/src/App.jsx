import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import DoctorAuth from "./pages/doctor/DoctorAuth";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorConsultations from "./pages/doctor/DoctorConsultations";
import PrescriptionForm from "./pages/doctor/PrescriptionForm";

import PatientAuth from "./pages/patient/PatientAuth";
import DoctorsList from "./pages/patient/DoctorsList";
import ConsultationForm from "./pages/patient/ConsultationForm";
import PatientPrescriptions from "./pages/patient/PatientPrescriptions";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    return (
        <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<Navigate to="/doctor" replace />} />

                <Route path="/doctor" element={<DoctorAuth />} />
                <Route path="/patient" element={<PatientAuth />} />

                <Route element={<ProtectedRoute role="doctor" />}>
                    <Route path="/doctor/profile" element={<DoctorProfile />} />
                    <Route path="/doctor/prescriptions" element={<DoctorConsultations />} />
                    <Route path="/doctor/prescriptions/:consultationId" element={<PrescriptionForm />} />
                </Route>

                <Route element={<ProtectedRoute role="patient" />}>
                    <Route path="/patient/doctors" element={<DoctorsList />} />
                    <Route path="/patient/consult/:doctorId" element={<ConsultationForm />} />
                    <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;