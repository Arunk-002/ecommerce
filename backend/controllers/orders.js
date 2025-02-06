const Cart = require("../models/cart");
const Order = require("../models/orders");

async function addOrder(req, res) {
  const cartId = req.params.id;
  const address = req.body;
  try {
    const cartData = await Cart.findById(cartId);
    const order = new Order({
      userId: cartData.userId,
      items: cartData.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      address,
      status: "pending",
    });

    const savedOrder = await order.save();
    const result = await Cart.findByIdAndDelete(cartId);
    console.log("delete cart", result);
    console.log("Order saved successfully:", savedOrder);
    return res.status(200).json({ savedOrder });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json(error.message);
  }
}


async function getOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("userId", "name email") // Fetch user details
      .populate("items.productId", "name price image"); // Fetch product details

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    return res.status(500).json({ success: false, message: "An error occurred while fetching orders." });
  }
}




async function getUserOrder(req, res) {
  const userId = req.params.id;
  try {
    const orders = await Order.find({ userId }).populate("items.productId");

    if (!orders.length) {
      return res.status(400).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateOrder(req, res) {
  const { id } = req.params;
  const { status } = req.body; // Get the status dynamically from the request

  try {
    // Ensure the status is valid
    const validStatuses = ["pending", "shipped", "delivered", "cancelled", "successed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    // Update order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = { updateOrder };


module.exports = {
  addOrder,
  getOrders,
  getUserOrder,
  updateOrder
};
