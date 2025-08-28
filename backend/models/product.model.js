import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  sizeStock: [
    {
      size: { type: String, enum: ["XS", "S", "M", "L", "XL"] },
      quantity: { type: Number, default: 0 },
    },
  ],
  image: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    enum: ["Men", "Women", "Kids"],
  },
  subCategory: {
    type: String,
  },
});

export default mongoose.model("Product", productSchema);
