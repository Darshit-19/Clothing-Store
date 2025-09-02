import express from 'express'
import { authorizeRoles, isAuthenticated } from '../middlewares/auth.middleware.js'
import { placeOrderScehma } from '../validation/product.validation.js'
import { validate } from '../middlewares/validate.middleware.js'
import { placeOrder, viewAllOrders, viewMyOrder, cancelOrder, updateOrder } from '../controllers/order.controller.js'

const router = express.Router()

// Admin Routes 
router.get('/admin', isAuthenticated, authorizeRoles('admin'), viewAllOrders)
router.put('/admin/:id', isAuthenticated, authorizeRoles('admin'), updateOrder)

// Normal User Routes
router.post('/', isAuthenticated, placeOrder)
router.get('/', isAuthenticated, viewMyOrder)
router.put('/:id/cancel', isAuthenticated, cancelOrder)




export default router