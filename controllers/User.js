import { catchAsyncError } from "../middlewares/auth.js"
import {User} from "../models/User.js"
import {Order} from "../models/Order.js"



//users controllers
export const profile=(req,res)=>{
    res.status(200).json({
        success:true,
        user:req.user
    })
}

export const logout=(req,res,next)=>{
    req.session.destroy((err)=>{
        if(err)
        {
            return next(err)
        }

        res.clearCookie("connect.sid")
        res.status(200).json({
            success:true,
            message:"Logged Out"
        })
    })
}




//admin controllers
export const Adminusers=catchAsyncError(async(req,res,next)=>{
    const users=await User.find({})

    res.status(200).json({
        success:true,
        users
    })
})

export const adminStats=catchAsyncError(async(req,res,next)=>{
    const totalusers=await User.countDocuments()

    const orders=await Order.find({})

    const preparingOrders=orders.filter((item)=>(item.orderStatus==="Preparing"))
    const shippedOrders=orders.filter((item)=>(item.orderStatus==="Shipping"))
    const deliveredOrders=orders.filter((item)=>(item.orderStatus==="Delivered"))

    let totalIncome=0

    orders.forEach((item)=>(
        totalIncome=totalIncome+item.totalAmount
    ))

    res.status(200).json({
        success:true,
        totalusers,
        ordersCount:{
            total:orders.length,
            preparing:preparingOrders.length,
            shipping:shippedOrders.length,
            delivered:deliveredOrders.length
        }
    })
})