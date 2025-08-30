import Product from "../models/product.model.js";

export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create product",
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const allProducts = await Product.find();
    if (allProducts.length === 0) {
      return res.status(404).json({ message: "No product found" });
    }
    res.status(200).json({
      message: "Products fetched successfully", 
      count: allProducts.length,
      products: allProducts
    });
  } catch (error) {
    console.error("Error in fetching products: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
