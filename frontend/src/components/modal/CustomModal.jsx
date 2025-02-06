import React from "react";
import axiosInstance from "../../axios/axios";
import {toast} from "react-hot-toast";
import { useDispatch } from "react-redux";
import { deleteProductData } from "../../redux/slice/productSlice";
const CustomModal = ({ id,cancel ,updateProducts}) => {
  const dispatch = useDispatch()
  const handleDelete=async()=>{    
    try {
        const response = await axiosInstance.delete(`admin/delete/${id}`)
        console.log(response.data);
        if (response.data) {
          dispatch(deleteProductData(response.data.id))
            updateProducts((prev) =>
                prev.filter((pro) => pro._id !== id)
              );
              
            cancel()
            toast.success('Successfully Deleted!');
        }
    } catch (error) {
        console.log(error);
        
    }
  }
  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-medium text-gray-900 mb-4" id="modal-title">
          Do you Want To Delete
        </h2>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={()=>{cancel()}}
          >
            No
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={()=>handleDelete()}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
