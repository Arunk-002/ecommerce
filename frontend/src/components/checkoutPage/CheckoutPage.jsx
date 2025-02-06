import React, { useState, useContext } from "react";
import axiosInstance from "../../axios/axios";
import toast from "react-hot-toast";
import { MdPlace } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import Loader from "../loader";
import { UserContext } from "../../context/UserContext";
import { useEffect } from "react";

const CheckoutPage = ({ id, addres, amount, cancel, cartCanel, cartId }) => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(addres);
  const [form, setForm] = useState(false);
  const [errors, setErrors] = useState({}); // State to store error messages
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    setErrors({
      ...errors,
      [id]: "", // Clear the error message when the user starts typing
    });
  };

  useEffect(() => {}, [address]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate each field
    if (!formData.street) {
      newErrors.street = "Street is required.";
      isValid = false;
    }

    if (!formData.city) {
      newErrors.city = "City is required.";
      isValid = false;
    }

    if (!formData.state) {
      newErrors.state = "State is required.";
      isValid = false;
    }

    if (!formData.zip) {
      newErrors.zip = "ZIP code is required.";
      isValid = false;
    } else if (formData.zip.length !== 6 || isNaN(formData.zip)) {
      newErrors.zip = "ZIP code must be a 6-digit number.";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      toast.error("Please correct the errors in the form.");
    }

    return isValid;
  };
  const updateOrder = async (orderId) => {
    try {
      const response = await axiosInstance.put(`/updateOrder/${orderId}`, { status: "successed" });
      
      if (response.data.success) {
        console.log("Order updated:", response.data.order);
      } else {
        console.log("Order update failed:", response.data.message);
      }
    } catch (error) {
      console.error("Order update error:", error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted", formData);
      setLoading(true);a
      try {
        const response = await axiosInstance.post(`/checkout/${id}`, formData);
        if (response.status === 200) {
          toast.success("Address added successfully!");
          setAddress((prev) => [...prev, formData]);
          setLoading(false);
          setForm(false);
          setFormData({
            street: "",
            city: "",
            state: "",
            zip: "",
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error.message);
        toast.error("Failed to add address. Please try again.");
        setLoading(false);
      }
    }
  };

  const addOrder = async () => {
    if (!address) {
      return;
    }
    try {
      const response = await axiosInstance.post(`/add-order/${cartId}`, {
        address,
      });
      console.log('order added ',response.data);
      
      return response.data.savedOrder._id
    } catch (error) {
      console.log(error.message);
    }
  };

  const createOrder = async () => {
    if (!loading) {
      setLoading(true);
    }
    try {
      const   orderId = await addOrder();
      const response = await axiosInstance.post("/payment/create-order", {
        amount: amount,
        currency: "INR",
      });
      if (response.status === 200) {
        setLoading(false);
        const order = response.data.order;
        await checkoutPayment(order);
        await updateOrder(orderId)
        console.log(order);
        cancel((prev) => !prev);
        cartCanel();
      }
    } catch (error) {
      toast.error("Error while creating order");
      console.log(error.message);
    }
  };
  const checkoutPayment = async (order) => {
    const options = {
      key: "rzp_test_ZKcJLyt29WoYex",
      amount: order.amount,
      currency: order.currency,
      name: "VINERGO",
      description: "Thank you for shopping with us!",
      order_id: order.id,
      handler: async function (response) {
        const paymentData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        };
        const result = await axiosInstance.post(
          "/payment/verify-payment",
          paymentData
        );
        if (result.data.success) {
          toast.success("Order Created");
        } else {
          toast.error("Error while creating order");
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: "9876543210",
      },
      theme: {
        color: "#AF6900",
      },
    };
    const razorpay = new Razorpay(options);
    razorpay.open();
  };

  return (
    <div className=" w-full max-w-3xl mx-auto p-8">
      {loading && <Loader />}
      <div className="bg-[#F5EBDA] p-8 rounded-lg shadow-md border">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Checkout</h1>
        <div className="overflow-y-scroll no-scrollbar h-36">
          {address &&
            address.map((elem, index) => (
              <label
                key={index}
                className={`w-full bg-white p-4 rounded-lg mb-6 flex gap-x-2 items-center text-[#AF6900] text-2xl font-black cursor-pointer ${
                  selectedAddress === index ? "border border-[#AF6900]" : ""
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  value={index}
                  checked={selectedAddress === index}
                  onChange={() => setSelectedAddress(index)}
                  className="mr-2"
                />
                <MdPlace />
                <p className="text-[#482817] text-lg ">
                  {elem.street}, {elem.city}, {elem.state}{" "}
                  <span>zip: {elem.zip}</span>
                </p>
              </label>
            ))}
        </div>
        <button
          onClick={() => setForm((prev) => !prev)}
          className="p-2 flex items-center gap-x-2 hover:border-[#AF6900] border-2 border-transparent rounded-lg text-[#482817] hover:font-bold"
        >
          <IoMdAdd />
          Select new Address
        </button>
        {form && (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Shipping Address
              </h2>

              <div className="mt-4">
                <label htmlFor="street" className="block text-gray-700 mb-1">
                  Street
                </label>
                <input
                  type="text"
                  id="street"
                  value={formData.street}
                  onChange={handleChange}
                  className={`w-full rounded-lg border py-2 px-3 ${
                    errors.street ? "border-red-600" : ""
                  }`}
                />
                {errors.street && (
                  <p className="text-red-600 text-sm">{errors.street}</p>
                )}
              </div>

              <div className="mt-4">
                <label htmlFor="city" className="block text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full rounded-lg border py-2 px-3 ${
                    errors.city ? "border-red-600" : ""
                  }`}
                />
                {errors.city && (
                  <p className="text-red-600 text-sm">{errors.city}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="state" className="block text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full rounded-lg border py-2 px-3 ${
                      errors.state ? "border-red-600" : ""
                    }`}
                  />
                  {errors.state && (
                    <p className="text-red-600 text-sm">{errors.state}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="zip" className="block text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="number"
                    id="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className={`w-full rounded-lg border py-2 px-3 ${
                      errors.zip ? "border-red-600" : ""
                    }`}
                  />
                  {errors.zip && (
                    <p className="text-red-600 text-sm">{errors.zip}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="bg-[#AF6900] text-white px-4 py-2 rounded-lg hover:bg-[#af6900f2]"
              >
                Add Address
              </button>
            </div>
          </form>
        )}
        {!form && (
          <button
            onClick={() => createOrder()}
            className="bg-[#AF6900] text-white px-4 py-2 rounded-lg hover:bg-[#af6900f2] mt-2 "
          >
            Place Order
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
