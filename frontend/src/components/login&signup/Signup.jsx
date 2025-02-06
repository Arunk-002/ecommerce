import React, { useContext, useState } from "react";
import axiosInstance from "../../axios/axios";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import OtpModal from "../modal/OtpModal";

export default function SignUp() {
  const navigate = useNavigate();
  const [isverified,setisverified]=useState(false)
  const[UserData,setUserData]=useState()
  const { setUser } = useContext(UserContext);
  const [otpModal, setOtpModal] = useState();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(document.getElementById("register-form"))
      const userData = {};
      for (let [key, value] of formData) {
        userData[key] = value;
      }
      setUserData(userData)
      const response = await axiosInstance.post("/emailverify",{email:userData.email});
      if (response.status === 200 && response.data.success) {
        setOtpModal(true);
      }
    } catch (error) {
      toast.error('email Invalid')
      console.log(error.message);
    }
  };

  if(isverified){
    userCreation()
  }
  async function userCreation() {
    try {
      const response = await axiosInstance.post("/signUp", UserData);
      const result = response.data;
      console.log(result);
      setUser(result.user);
      if (result.user.role === "admin") {
        navigate("/admin");
      } else if (result.user.role === "user") {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  }

  return (
    <>
      <div className=" bg-[#F5EBD] h-screen flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
          <img
            width="100"
            height="100"
            src="public/logo-symbol.png"
            alt="import"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Create Your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            id="register-form"
            className="space-y-6"
            onSubmit={handleFormSubmit}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md  bg-[#af6900ba] px-3 py-1.5 text-sm/6 font-semibold text-[#623D2A] shadow-sm hover: hover:bg-[#af6900] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Already a member?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#623D2A] hover:text-[#623D2A]"
            >
              Login Here
            </Link>
          </p>
        </div>
      </div>
      {otpModal && <OtpModal email={UserData.email} cancel={setOtpModal} verifier={setisverified}/>}
    </>
  );
}
