import { useContext, useState } from "react";
import axiosInstance from "../axios/axios";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";

const useAddToCart = (productId) => {
  const { user } = useContext(UserContext);
  const addToCart = async (e) => {
    e.stopPropagation()
    if (!user?._id) {
      toast.error("Please login to add to cart");
      return;
    }
    const msg = { productId };

    try {
      const response = await axiosInstance.post(`/addToCart/${user._id}`, msg);
      toast.success("Product added to cart!");
      console.log('added to cart',response.data);
      
      return response.data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product to cart");
    }
  };

  return { addToCart };
};

export default useAddToCart;
