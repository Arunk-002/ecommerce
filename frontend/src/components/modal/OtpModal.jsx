import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios";
import toast from "react-hot-toast";

function OtpModal({ email, cancel, verifier }) {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    sendOtp();
  }, []);

  // Function to send OTP
  const sendOtp = async () => {
    console.log(email);
    
    try {
      const response = await axiosInstance.post("/sendmail", { to:email });
      if (response.data.success) {
        setOtpSent(true);
      }
    } catch (error) {
      setErrorMessage("Please enter a valid email");
    }
  };

  // Function to handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Only accept numbers
    setOtp(value.slice(0, 4)); // Restrict to 4 characters
  };

  // Function to verify OTP
  const verifyOtp = async () => {
    try {
      const response = await axiosInstance.post("/verifyotp", { email, otp });
      if (response.data.success) {
        verifier(true);
        toast.success("OTP Verified");
        cancel(false);
      } else {
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Verification failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-4">Enter OTP</h1>
        <p className="text-gray-600 mb-4">Code sent to <span className="font-bold">{email}</span></p>

        {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}

        <div className="flex justify-center mb-4">
          <input
            type="text"
            maxLength="4"
            value={otp}
            onChange={handleOtpChange}
            className="w-32 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center space-x-2 my-2">
          <button
            className="text-sm text-gray-500 hover:text-blue-500"
            onClick={sendOtp}
          >
            {otpSent ? "Request Again" : "Request OTP"}
          </button>
        </div>

        <button
          className="w-full py-2 text-lg text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={verifyOtp}
        >
          Verify
        </button>
      </div>
    </div>
  );
}

export default OtpModal;
