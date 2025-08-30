import Product from "../models/product.model.js";

export const addProduct = async (req, res) => {
  try {
    // // Destructure fields from request body
    // const {
    //   name,
    //   description,
    //   price,
    //   sizeStock,
    //   category,
    //   subCategory,
    //   image,
    // } = req.body;

    // // Check required fields
    // if (!name || !price || !sizeStock || !category || !image) {
    //   return res.status(400).json({
    //     message: "name, price, sizeStock, category, and image are required",
    //   });
    // }

    // // Validate price
    // if (typeof price !== "number" || price <= 0) {
    //   return res.status(400).json({
    //     message: "price must be a positive number",
    //   });
    // }

    // // Validate sizeStock
    // if (!Array.isArray(sizeStock) || sizeStock.length === 0) {
    //   return res.status(400).json({
    //     message: "sizeStock must be a non-empty array",
    //   });
    // }

    // // Validate each sizeStock object
    // const allowedSizes = ["XS", "S", "M", "L", "XL"];
    // for (let item of sizeStock) {
    //   if (!item.size || !allowedSizes.includes(item.size)) {
    //     return res.status(400).json({
    //       message: `Invalid size: ${
    //         item.size
    //       }. Allowed sizes: ${allowedSizes.join(", ")}`,
    //     });
    //   }
    //   if (typeof item.quantity !== "number" || item.quantity < 0) {
    //     return res.status(400).json({
    //       message: `Quantity for size ${item.size} must be a non-negative number`,
    //     });
    //   }
    // }

    // // Validate category
    // const allowedCategories = ["Men", "Women", "Kids"];
    // if (!allowedCategories.includes(category)) {
    //   return res.status(400).json({
    //     message: "category must be one of: Men, Women, Kids",
    //   });
    // }

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
