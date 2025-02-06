import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../axios/axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/admin/get-Orders");
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/updateOrder/${orderId}`, { status: newStatus });

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="bg-[#F5EBDA] h-[99vh] p-3">
      <h1 className="text-2xl font-bold">Orders</h1>
      <table className="w-full text-sm text-left bg-white mt-4">
        <thead className="bg-gray-500 text-white">
          <tr>
            <th className="px-6 py-3">Order ID</th>
            <th className="px-6 py-3">Customer</th>
            <th className="px-6 py-3">Total Price</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b">
              <td className="px-6 py-4">{order._id}</td>
              <td className="px-6 py-4">{order.userId.name} ({order.userId.email})</td>
              <td className="px-6 py-4">
                ${order.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
              </td>
              <td className="px-6 py-4">{order.status}</td>
              <td className="px-6 py-4">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="px-2 py-1 border rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="successed">Successed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
