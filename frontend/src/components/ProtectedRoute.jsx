import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, [setUser]);

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;
