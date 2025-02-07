import { createContext, useState, useEffect } from "react";
import axiosInstance from "../axios/axios";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [isLoading, setIsLoading] = useState(true);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            const response = await axiosInstance.get("/logout");
            if (response.status === 201) {
                setUser(null);
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error('Logout failed:', error);
            // Still clear local data even if server request fails
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    // Verify token by making a request to any protected route
    const verifyUserSession = async () => {
        try {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                // Make a request to any protected route, e.g., get user profile
                const userId = JSON.parse(savedUser)._id; // or however you store the user ID
                await axiosInstance.get(`/getUser/${userId}`);
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            setUser(null);
            localStorage.removeItem('user');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        verifyUserSession();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Or your loading component
    }

    return (
        <UserContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
