import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch (err) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }

        setIsLoading(false);
    }, []);

    const handleLogin = (authData) => {
        localStorage.setItem("token", authData.token);
        localStorage.setItem("user", JSON.stringify(authData.user));

        setToken(authData.token);
        setUser(authData.user);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    const isLoggedIn = Boolean(token);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading: isLoading,
                isAuthenticated: isLoggedIn,
                login: handleLogin,
                logout: handleLogout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return ctx;
};