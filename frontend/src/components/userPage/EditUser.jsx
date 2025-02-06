import React, { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import axiosInstance from "../../axios/axios";
import { toast } from "react-hot-toast";

const EditUser = ({ id, user, cancel, updateUser }) => {
  const [userData, setUserData] = useState({
    name: user.name,
    password: "",
    role: user.role,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!userData.name.trim()) validationErrors.name = "Name is required.";
    if (!userData.password.trim()) validationErrors.password = "Password is required.";
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/editUser/${id}`, userData);
      if (response.status === 200) {
        toast.success("User updated successfully!");
        updateUser(response.data.user);
        cancel(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/[.6] fixed inset-0 py-5 z-50 ">
      <div className="bg-gray-100 p-4 -top-5 max-w-[500px] w-full relative ml-auto transition-transform duration-700 ease-in-out animate-slide-in">
        <button className="text-3xl absolute top-4 right-4" onClick={()=>cancel(false)}>
          <IoIosCloseCircle />
        </button>
        <h2 className="text-center text-2xl font-bold text-gray-900">Edit User</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
