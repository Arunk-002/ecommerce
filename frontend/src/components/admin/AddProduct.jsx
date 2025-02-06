import React, { useState, useRef } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import axiosInstance from "../../axios/axios";
import { toast } from "react-hot-toast";
import { addProductData } from "../../redux/slice/productSlice";
import { useDispatch } from "react-redux";
import Loader from "../Loader";
const AddProduct = ({ cancel, updateProducts }) => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const imageInputRef = useRef(null);
  const dispatch = useDispatch();
  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setProductData((prevData) => {
        const updatedData = { ...prevData };
        if (checked) {
          updatedData[name] = [...updatedData[name], value];
          console.log(updatedData);
        } else {
          updatedData[name] = updatedData[name].filter(
            (item) => item !== value
          );
        }
        return updatedData;
      });
    } else {
      setProductData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const validationErrors = {};
    const regex = /^[a-zA-Z0-9\s]+$/;

    // Name validation
    if (!productData.name.trim()) {
      validationErrors.name = "Product name is required.";
    } else if (productData.name.length > 100) {
      validationErrors.name = "Product name should not exceed 100 characters.";
    }

    // Description validation
    if (!productData.description.trim()) {
      validationErrors.description = "Product description is required.";
    } else if (productData.description.length > 500) {
      validationErrors.description =
        "Product description should not exceed 500 characters.";
    }

    // Price validation
    if (productData.price <= 0) {
      validationErrors.price = "Price must be greater than 0.";
    }

    // Category validation
    if (!productData.category) {
      validationErrors.category = "Category is required.";
    }

    // Stock validation
    if (productData.stock <= 0) {
      validationErrors.stock = "Stock quantity must be greater than 0.";
    }

    // Image validation
    if (!image) {
      validationErrors.image = "Product image is required.";
    }

    return validationErrors;
  };

  const addProduct = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", image);
      console.log("Original Product Data:", productData);
      Object.entries(productData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      });
      formData.forEach((value, key) => {
        console.log(key, typeof value);
      });

      const response = await axiosInstance.post("/admin/addProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        dispatch(addProductData(response.data?.product));
        toast.success("Successfully added Product!");
        setProductData({
          name: "",
          description: "",
          price: 0,
          category: "",
          stock: 0,
        });
        setImage(null);
        imageInputRef.current.value = null; // Reset the file input field
        updateProducts((prev) => [response.data.product, ...prev]);
        setLoading(false);
        cancel();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-black/[.6] fixed inset-0 py-5 z-50 ">
      {loading && <Loader />}
      <div className="bg-gray-100 -top-5 max-w-[500px] w-full relative ml-auto transition-transform duration-700 ease-in-out animate-slide-in">
        <button
          className="justify-end text-3xl absolute top-7 right-7"
          onClick={() => cancel((prev) => !prev)}
        >
          <IoIosCloseCircle />
        </button>
        <div className="flex h-[100vh] flex-1 flex-col px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex justify-between">
              <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                Add a New Product
              </h2>
            </div>
          </div>
          <div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm ">
              <form
                id="add-product-form"
                className="space-y-6"
                onSubmit={addProduct}
              >
                <div className="overflow-y-scroll h-[68vh] no-scrollbar">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm/6 font-medium text-gray-900 after:content-['*'] after:ml-0.5 after:text-red-500"
                    >
                      Product Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={productData.name}
                        onChange={handleProductChange}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm/6 font-medium text-gray-900 after:content-['*'] after:ml-0.5 after:text-red-500"
                    >
                      Product Description
                    </label>
                    <div className="mt-2">
                      <input
                        id="description"
                        name="description"
                        type="text"
                        value={productData.description}
                        onChange={handleProductChange}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm">
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm/6 font-medium text-gray-900 after:content-['*'] after:ml-0.5 after:text-red-500"
                    >
                      Price
                    </label>
                    <div className="mt-2">
                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        value={productData.price}
                        onChange={handleProductChange}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm">{errors.price}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm/6 font-medium text-gray-900 after:content-['*'] after:ml-0.5 after:text-red-500"
                    >
                      Category
                    </label>
                    <div className="mt-2">
                      <select
                        id="category"
                        name="category"
                        value={productData.category}
                        onChange={handleProductChange}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      >
                        <option value="">Select Category</option>
                        <option value="redwine">red wine</option>
                        <option value="whitewine">white wine</option>
                        <option value="rosewine">rose wine</option>
                        <option value="sparklingwine">sparkling wine</option>
                        <option value="other">other</option>
                      </select>
                      {errors.category && (
                        <p className="text-red-500 text-sm">
                          {errors.category}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="stock"
                      className="block text-sm/6 font-medium text-gray-900 after:content-['*'] after:ml-0.5 after:text-red-500"
                    >
                      Stock Quantity
                    </label>
                    <div className="mt-2">
                      <input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        value={productData.stock}
                        onChange={handleProductChange}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                      {errors.stock && (
                        <p className="text-red-500 text-sm">{errors.stock}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    {image ? (
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Product"
                        className="w-full h-40 object-contain rounded-md"
                      />
                    ) : null}
                  </div>
                  <div>
                    <label
                      htmlFor="image"
                      className="block text-sm/6 font-medium text-gray-900 after:content-['*'] after:ml-0.5 after:text-red-500"
                    >
                      Product Image
                    </label>
                    <div className="mt-2">
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                        ref={imageInputRef}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                      {errors.image && (
                        <p className="text-red-500 text-sm">{errors.image}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="cursor-pointer flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
