import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-4xl font-bold text-red-500">404</h1>
            <p className="text-lg text-gray-600">Oops! The page you’re looking for doesn’t exist.</p>
            <Link to="/login" className="mt-4 text-blue-500 underline">
                Go to Login
            </Link>
        </div>
    );
};

export default NotFound;
