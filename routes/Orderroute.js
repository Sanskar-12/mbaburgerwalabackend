import express from "express"
import {adminAuth, isAuthenticated} from "../middlewares/auth.js"
import { MyOrders, getAdminOrders, getOrderDetails, paymentVerifictaion, placeOrder, placeOrderOnline, processStatus } from "../controllers/Order.js"


const router=express.Router()

router.post("/createOrder",isAuthenticated,placeOrder)

router.post("/createOrderonline",isAuthenticated,placeOrderOnline)

router.post("/paymentverification",isAuthenticated,paymentVerifictaion)

router.get("/myorders",isAuthenticated,MyOrders)

router.get("/order/:id",isAuthenticated,getOrderDetails)


//admin authentication Middleware
router.get("/admin/orders",isAuthenticated,adminAuth,getAdminOrders)

router.get("/admin/order/:id",isAuthenticated,adminAuth,processStatus)

export default router