import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId, status: "active" }).populate(
      "items.productId"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const order = new Order({
      userId,
      items: orderItems,
      status: "pending",
      total: cart.total,
    });

    await order.save();

    cart.status = "ordered";
    await cart.save();

    res.status(201).json({ message: "Order succesfully placed", order });
  } catch (error) {
    console.error("Error in placing order: ", error.message);
    res.status(500).json({ message: "Somthing went wrong" });
  }
};

export const viewMyOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .populate("items.productId", "name price image")
      .sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No order for the user" });
    }

    return res
      .status(200)
      .json({ message: "Order fetched succesfully", orders });
  } catch (error) {
    console.error("Error while fetching orders", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const viewAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json({ message: "Order fetched succesfully", orders });
  } catch (error) {
    console.error("Error in fetching orders", error.message);
    res.status(500).json({ message: "Somthing went wrong" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ message: "No orders found" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Can not delete this reques at this stage" });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled succesfully" });
  } catch (error) {
    console.error("Error while deleting order :", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status field required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error while updating order:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};
