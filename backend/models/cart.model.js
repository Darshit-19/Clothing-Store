import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    min: 1,
    required: true,
  },
  selectedSize: {
    type: String,
    enum: ["XS", "S", "M", "L", "XL"],
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    status: {
      type: String,
      enum: ["active", "ordered"],
      default: "active",
    },
    total: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", cartSchema);
