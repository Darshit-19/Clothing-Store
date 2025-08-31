import Product from "../models/product.model.js";

export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error while adding product: ", error.message);
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
      products: allProducts,
    });
  } catch (error) {
    console.error("Error in fetching products: ", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product found", product });
  } catch (error) {
    console.error("Error in finding the product : ", error.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({ message: "Product id required" });
    }
    const product = await Product.findByIdAndUpdate(productId, req.body,{
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({
        message: "Product updated succesfully",
        updatedProduct: product,
      });
  } catch (error) {
    console.error("Error in updating product ", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({
        message: "Product deleted Succesfully",
        deletedProduct: product,
      });
  } catch (error) {
    console.error("Error while deleting the product", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};
