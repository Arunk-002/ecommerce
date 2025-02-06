import React, { useEffect, useState, useContext } from "react";
import { IoMdClose } from "react-icons/io";
import axiosInstance from "../../axios/axios";
import { UserContext } from "../../context/UserContext";

const OrderPage = ({ cancel }) => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(`/myOrders/${user._id}`);
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user._id) {
      fetchOrders();
    }
  }, [user._id]);

  return (
    <div className="bg-black/[.6] fixed inset-0 py-5 z-50 flex">
      <div className="bg-[#F5EBDA] p-5 rounded-md h-[100vh] -top-5 max-w-[500px] w-full relative ml-auto transition-transform duration-700 ease-in-out animate-slide-in">
        <div className="flex flex-col justify-between h-full">
          <div className="p-4 flex flex-col gap-y-7">
            <div className="flex justify-between">
              <h2 className="text-2xl text-[#482817]">Your Orders</h2>
              <button className="text-xl text-[#482817]" onClick={cancel}>
                <IoMdClose />
              </button>
            </div>
            {loading ? (
              <p className="text-center text-gray-500">Loading orders...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : orders.length === 0 ? (
              <div className="text-center text-2xl text-[#482817] font-semibold">
                No orders found
              </div>
            ) : (
              <div className="flow-root overflow-y-scroll max-h-[60vh] no-scrollbar">
                <ul role="list" className="-my-6 divide-y divide-[#AF6900]">
                  {orders.map((order) => (
                    <li key={order._id} className="flex flex-col py-6">
                      <p className="text-sm text-gray-500">
                        Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="font-medium text-blue-600">
                        Status: {order.status}
                      </p>

                      <div className="mt-3">
                        {order.items.map((item) => (
                          <div key={item.productId._id} className="flex py-4 border-b border-[#AF6900]">
                            <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={item.productId.image || "https://via.placeholder.com/150"}
                                alt={item.productId.name}
                                className="size-full object-contain"
                              />
                            </div>

                            <div className="ml-4 flex flex-col flex-1">
                              <h3 className="text-[#482817] font-medium">
                                {item.productId.name}
                              </h3>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              <p className="text-sm text-gray-700">Price: ${item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-right font-semibold text-[#482817]">
                        Total: $
                        {order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
