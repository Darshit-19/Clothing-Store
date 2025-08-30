import { z } from 'zod';

// Define constants for reusable validation
const ALLOWED_SIZES = ["XS", "S", "M", "L", "XL"];
const ALLOWED_CATEGORIES = ["Men", "Women", "Kids"];

// Define the schema for adding a product
export const addProductSchema = z.object({
  name: z.string({ required_error: "Product name is required" })
         .min(1, "Product name cannot be empty"),
         
  description: z.string().optional(), // This field is optional

  price: z.number({ required_error: "Price is required" })
           .positive("Price must be a positive number"),

  category: z.enum(ALLOWED_CATEGORIES, {
    errorMap: () => ({ message: `Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}` }),
  }),

  subCategory: z.string().optional(), // Optional field

  image: z.string({ required_error: "Image is required" })
           .min(1, "Image cannot be empty"),
           // .url("Image must be a valid URL") // Uncomment if you want to enforce a valid URL format

  sizeStock: z.array(
    z.object({
      size: z.enum(ALLOWED_SIZES, { 
        errorMap: () => ({ message: `Invalid size provided. Allowed sizes are ${ALLOWED_SIZES.join(", ")}` }) 
      }),
      quantity: z.number({ required_error: "Quantity is required for each size" })
                  .min(0, "Quantity cannot be a negative number"),
    })
  ).min(1, "At least one size and stock option must be provided"),
});