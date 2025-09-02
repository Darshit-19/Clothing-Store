import mongoose from "mongoose"
import Product from '../models/product.model.js'

export const calculateCartTotal = async (items) => {
    let total = 0

    for(const item of items){
        const product = await Product.findById(item.productId)
        if(product){
            total += item.quantity * product.price
        }
    }
    return total
}