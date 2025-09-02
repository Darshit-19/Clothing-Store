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
    const userId = req.params.id;

    const orders = await Order.findOne({ userId })
      .populate("items.productId", "name", "price", "image")
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
