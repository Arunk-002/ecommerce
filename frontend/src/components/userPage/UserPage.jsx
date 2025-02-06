import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../axios/axios";
import { MdPlace } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import EditUser from "./EditUser";
import OtpModal from "../modal/OtpModal";

const UserForm = () => {
  const [editForm,setEditForm]=useState(false)
  const { user } = useContext(UserContext);
  const[verify,setVerify]=useState(false)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
  });
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const response = await axiosInstance.get(`/getUser/${user._id}`);

      if (response.status === 201) {
        const { name, email, password, address } = response.data.user;

        setUserData({
          name: name || "",
          email: email || "",
          password: password || "",
          address: address || {
            street: "",
            city: "",
            state: "",
            zip: "",
          },
        });
      }
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="w-[50%] mx-auto h-[80vh] bg-[#FAF7F2] rounded-xl shadow-md p-8 mt-2 gap-y-10 flex flex-col">
      <div className="bg-[url('/landing-bg.png')] w-full h-[30%] bg-cover bg-center rounded-md flex items-end justify-center">
        <div className="border-4 border-[#AF6900] rounded-full w-32 h-32 flex items-center justify-center -mb-[50px]">
          <p className="text-6xl font-bold text-[#482817]">
            {userData.name[0]?.toUpperCase() || "A"}
          </p>
        </div>
      </div>
      <div className="mt-8 flex  flex-col gap-y-4">
        <div className="flex justify-around items-center  border-2 rounded-lg p-4 border-[#AF6900] w-[70%]">
          <p className="text-[#482817] font-bold uppercase">
            name :
            <span className="capitalize text-lg text-[#9E845C]">
              {userData.name}
            </span>
          </p>
          <p className="text-[#482817] font-bold uppercase">
            email :
            <span className="capitalize text-lg text-[#9E845C]">
              {userData.email}
            </span>
          </p>
          <button onClick={()=>setEditForm((prev)=>!prev)} className="hover:text-[#AF6900] text-lg font-bold">
          <CiEdit />
          </button>
        </div>
        <div className="flex flex-col gap-y-2 ">
          <h3 className="text-[#482817] capitalize text-xl font-bold">
            Address
          </h3>
          <div className="flex flex-col gap-y-4">
            {userData.address.length > 0 &&
              userData.address.map((elem) => {
                return (
                  <div
                    className="flex p-3 text-[#482817] items-center gap-x-2 text-xl capitalize border-2 rounded-lg w-[60%] border-[#AF6900]"
                    key={elem._id}
                  >
                    <MdPlace />
                    <div className="flex justify-between w-full items-center">
                      <p className="text-lg text-[#9E845C]">
                        {elem.street} , {elem.city} , {elem.state}{" "}
                        <span>zip: {elem.zip}</span>
                      </p>
                      <button className="bg-transparent hover:text-red-700">
                        <MdOutlineDelete />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {verify&&<EditUser id={user._id} user={userData} cancel={setVerify} updateUser={setUserData} />}
      {editForm&&<OtpModal email={user.email} cancel={setEditForm} verifier={setVerify}/>}
    </div>
  );
};

export default UserForm;
