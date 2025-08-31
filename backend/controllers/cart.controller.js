import Cart from "../models/cart.model";
import Product from "../models/product.model";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, selectedSize, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const sizeStock = product.sizeStock.find(
      (item) => item.size === selectedSize
    );
    if (!sizeStock) {
      return res.status(400).json({ message: "Selected size not available" });
    }

    if (quantity > sizeStock.quantity) {
      return res
        .status(400)
        .json({ message: "Not enough stock for selected size" });
    }

    let cart = await Cart.findOne({ userId, status: "active" });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, selectedSize, quantity }],
      });
      await cart.save();
      return res
        .status(201)
        .json({ message: "Product added to the cart", cart });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.selectedSize === selectedSize
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, selectedSize, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding product to cart:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const viewCart = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User Id is required" });
    }

    const cart = await Cart.findone({userId}).populate("items.productId");
    if (!cart || cart.item.length === 0) {
      return res.status(404).json({ message: "Cart not found or empty" });
    }

    res.status(200).json({ message: "Cart found", yourCart: cart });
  } catch (error) {
    console.error("Error in finding your cart", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};
