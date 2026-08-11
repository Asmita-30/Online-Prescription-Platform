import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate(user?.role === "doctor" ? "/doctor" : "/patient");
    };

    const goToDashboard = () => {
        if (user?.role === "doctor") {
            navigate("/doctor/profile");
        } else {
            navigate("/patient/doctors");
        }
    };

    const userInitial = user?.name?.charAt(0)?.toUpperCase() || "";
    const userRole = user?.role === "doctor" ? "Doctor" : "Patient";

    return (
        <nav className="navbar">
            <div className="navbar-brand" onClick={goToDashboard}>
                <div className="navbar-logo">+</div>
                <span>Medi<span>Care</span></span>
            </div>

            <div className="navbar-right">
                <div className="navbar-user">
                    {user?.profilePicUrl ? (
                        <img src={user.profilePicUrl} alt={user.name} />
                    ) : (
                        <div className="user-avatar">{userInitial}</div>
                    )}
                    <div className="user-info">
                        <strong>{user?.name}</strong>
                        <small>{userRole}</small>
                    </div>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;