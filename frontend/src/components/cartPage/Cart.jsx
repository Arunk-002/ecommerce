import React, { useContext, useEffect, useState, useMemo } from "react";
import { IoMdClose } from "react-icons/io";
import axiosInstance from "../../axios/axios";
import { UserContext } from "../../context/UserContext";
import toast from "react-hot-toast";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import CheckoutPage from "../checkoutPage/CheckoutPage";

function Cart({ cancel }) {
  const [Product, setProducts] = useState([]);
  const [address, setAddress] = useState(null);
  const { user } = useContext(UserContext);
  const [checkPage, setcheckPage] = useState(false);
  const [cartId, setid] = useState(null);
  useEffect(() => {
    fetchCart();
  }, []);
  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get(`/getCart/${user._id}`);
      if (response.status === 200) {
        const ProductDetails = response.data.cart.items;
        if (response.data.address) {
          console.log(response.data.address);
          setAddress(response.data.address);
        }else{
          setAddress(null)
        }
        setid(response.data.cart._id);
        setProducts(ProductDetails);
        console.log("product deatils", ProductDetails);
      }
    } catch (error) {
      console.log(error.message);
      setProducts([]);
    }
  };

  const totalPrice = useMemo(() => {
    return Product.reduce((acc, elem) => acc + elem.price * elem.quantity, 0);
  }, [Product]);

  async function removeFromCart(index) {
    try {
      const response = await axiosInstance.delete(
        `/delfromCart/${user._id}/${index}`
      );
      if (response.status === 200) {
        setProducts(response.data.cart.items);
        console.log(response.data.cart.items);

        toast.success(response.data.msg);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function quantity(action, productId, curCount) {
    if (curCount <= 0 && action == "minus") return;
    try {
      const response = await axiosInstance.post(`/quantity/${cartId}`, {
        action: action,
        productId: productId,
      });

      if (response.status === 200) {
        console.log(response.data);

        setProducts((prev) =>
          prev.map((product) => {
            if (product._id === productId) {
              return {
                ...product,
                quantity:
                  action === "add"
                    ? product.quantity + 1
                    : product.quantity > 0
                    ? product.quantity - 1
                    : 0, // Ensure quantity doesn't go below 0
              };
            }
            return product;
          })
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="bg-black/[.6] fixed inset-0 py-5 z-50 flex ">
      {checkPage && <CheckoutPage id={user._id} cartId={cartId} addres={address} amount={totalPrice} cancel={setcheckPage} cartCanel={cancel}/>}
      <div className="bg-[#F5EBDA] p-5 rounded-md h-[100vh] -top-5 max-w-[500px] w-full relative ml-auto transition-transform duration-700 ease-in-out animate-slide-in">
        <div className=" flex flex-col justify-between h-full">
          <div className="p-4 flex flex-col gap-y-7">
            <div className="flex justify-between">
              <h2 className="text-2xl text-[#482817]">Cart</h2>
              <button
                className="text-xl text-[#482817]"
                onClick={() => cancel()}
              >
                <IoMdClose />
              </button>
            </div>
            <div className="flow-root overflow-y-scroll max-h-[60vh] no-scrollbar">
              <ul role="list" className="-my-6 divide-y divide-[#AF6900]">
                {Product && Product.length ? (
                  Product.map((product) => (
                    <li key={product.id} className="flex py-6">
                      <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          alt={product.productId.name}
                          src={product.productId.image}
                          className="size-full object-contain"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium ">
                            <h3 className="text-[#482817]">
                              {product.productId.name}
                            </h3>
                            <p className="ml-4 text-[#482817]">
                              {product.productId.price}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center gap-x-3">
                            <p className="text-[#9E845C] text-lg">
                              Qty {product.quantity}
                            </p>
                            <div className="flex items-center gap-x-1 text-lg">
                              <button
                                onClick={() =>
                                  quantity("add", product._id, product.quantity)
                                }
                              >
                                <CiCirclePlus />
                              </button>
                              <button
                                onClick={() =>
                                  quantity(
                                    "minus",
                                    product._id,
                                    product.quantity
                                  )
                                }
                              >
                                <CiCircleMinus />
                              </button>
                            </div>
                          </div>
                          <div className="flex">
                            <button
                              type="button"
                              className="font-medium text-[#AF6900] hover:text-[#af6900c9]"
                              onClick={() => removeFromCart(product._id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className=" flex py-6">
                    <h1 className="text-4xl">Cart Epmty</h1>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="bottom-0 border-t border-[#AF6900] px-4 pt-3 sm:px-6 align-end ">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>{totalPrice ? totalPrice : 0}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-6 w-full">
              <button
                onClick={() => {
                  setcheckPage((prev) => !prev);
                }}
                className="flex w-full items-center text-[#FAF7F2] justify-center rounded-md border border-transparent bg-[#AF6900] px-6 py-3 text-base font-medium  shadow-sm hover:bg-[#af6900f2]"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
