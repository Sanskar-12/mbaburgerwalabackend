import { catchAsyncError } from "../middlewares/auth.js";
import { Order } from "../models/Order.js";
import { instance } from "../server.js";
import ErrorHandler from "../utils/ErrorClass.js";
import crypto from "crypto"
import {Payment} from "../models/Payment.js"

export const placeOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;

  const user = req.user._id;

  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user,
  };

  await Order.create(orderOptions);

  res.status(200).json({
    success: true,
    message: "Order placed successfully via Cash on Delivery",
  });
});

export const placeOrderOnline = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
  } = req.body;

  const user = req.user._id;

  const orderOptions = {
    shippingInfo,
    orderItems,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingCharges,
    totalAmount,
    user,
  };

  const options = {
    amount: Number(totalAmount) * 100,
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
    orderOptions,
  });
});

export const paymentVerifictaion = catchAsyncError(async (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature,orderOptions } =req.body;

  const body=razorpay_order_id+"|"+razorpay_payment_id
  const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex")

  const isAuthentic=expectedSignature===razorpay_signature

  if(isAuthentic)
  {
    const payment=await Payment.create({
        razorpay_payment_id, razorpay_order_id, razorpay_signature
    })
    await Order.create({
        ...orderOptions,
        paidAt:Date.now(),
        paymentInfo:payment._id
    })

    res.status(200).json({
        success:true,
        message:`Order Placed Successfully, Payment Id:${payment._id}`
    })
  }
  else
  {
    return next(new ErrorHandler("Payment Failed",400))
  }
});

export const MyOrders = catchAsyncError(async (req, res, next) => {
  const order = await Order.find({
    user: req.user._id,
  }).populate("user", "name");

  res.status(200).json({
    success: true,
    order,
  });
});

export const getOrderDetails = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const order = await Order.findById(id).populate("user", "name");

  if (!order) {
    return next(new ErrorHandler("Invalid Order Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

export const getAdminOrders = catchAsyncError(async (req, res, next) => {
  const order = await Order.find({}).populate("user", "name");

  res.status(200).json({
    success: true,
    order,
  });
});

export const processStatus = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Invalid Order Id", 404));
  }

  if (order.orderStatus === "Preparing") {
    order.orderStatus = "Shipping";
  } else if (order.orderStatus === "Shipping") {
    order.orderStatus = "Delivered";
    order.deliveredAt = Date.now();
  } else if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("Already Delivered", 400));
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Status Updated Successfully",
  });
});
