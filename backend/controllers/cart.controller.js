import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { calculateCartTotal } from "../utils/cart.utils.js";

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

    let cart = await Cart.findOne({ userId, status: "active" })

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
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ productId, selectedSize, quantity });
    }

    //calculate the cart total
    cart.total = await calculateCartTotal(cart.items)

    await cart.save();
    await cart.populate("items.productId", "name")
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

    const cart = await Cart.findOne({ userId }).populate("items.productId" , "name");
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart not found or empty" });
    }

    res.status(200).json({ message: "Cart found", yourCart: cart });
  } catch (error) {
    console.error("Error in finding your cart", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size, quantity } = req.body;

    if (!productId || !size || quantity === undefined) {
      return res
        .status(400)
        .json({ message: "productId , size and quantity are required" });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity must be >= 0" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Invalid Product" });
    }

    //Find product in cart with same productId
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId && item.selectedSize === size
    );

    if (itemIndex > -1) {
      //product  already exist in the cart : update it
      if (quantity > 0) {
        cart.items[itemIndex].quantity = quantity; // update quantity
      } else {
        cart.items.splice(itemIndex, 1); //remove item
      }
    } else {
      //product do not exist in cart : add product
      cart.items.push({ productId, selectedSize: size, quantity });
    }

    //calculate the cart total
    cart.total = await calculateCartTotal(cart.items)

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate(
      "items.productId"
    );

    res.status(200).json({ message: "Cart Updated Succesfully", updatedCart });
  } catch (error) {
    console.error("Error in updating cart:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId, status: "active" });
    if (!cart) {
      return res.status(404).json({ message: "No active cart for the user" });
    }
    cart.items = [];

    //calculate the cart total
    cart.total = await calculateCartTotal(cart.items)
    
    await cart.save();

    res.status(200).json({ message: "Cart deleted succesfully" });
  } catch (error) {
    console.error("Error in deleting the cart", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};
