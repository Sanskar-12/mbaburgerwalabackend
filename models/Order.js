import mongoose from "mongoose"

const schema=new mongoose.Schema({
    shippingInfo:{
        hno:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        },
        phoneno:{
            type:Number,
            required:true
        },
    },
    orderItems:{
        cheeseBurger:{
            price:{
                type:Number,
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
            }
        },
        chickenCheeseBurger:{
            price:{
                type:Number,
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
            }
        },
        macWhooperburger:{
            price:{
                type:Number,
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
            }
        },
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    paymentMethod:{
        type:String,
        enum:["COD","Online"],
        default:"COD",
    },
    paymentInfo:{
        type:mongoose.Schema.ObjectId,
        ref:"Payment"
    },
    paidAt:{
        type:Date,
    },
    itemsPrice:{
        type:Number,
        default:0
    },
    taxPrice:{
        type:Number,
        default:0
    },
    shippingCharges:{
        type:Number,
        default:0
    },
    totalAmount:{
        type:Number,
        default:0
    },
    orderStatus:{
        type:String,
        enum:["Preparing","Shipping","Delivered"],
        default:"Preparing"
    },
    deliveredAt:{
        type:Date,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
    
})

export const Order=mongoose.model("Order",schema)