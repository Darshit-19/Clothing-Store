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

    cart.status = "ordered"
    await cart.save();

    res.status(201).json({ message: "Order succesfully placed", order });
  } catch (error) {
    console.error("Error in placing order: ", error.message);
    res.status(500).json({ message: "Somthing went wrong" });
  }
};
