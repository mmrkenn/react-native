import { asyncErrorHandler } from "../middlewares/errorHandler.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { isAuth } from "../middlewares/auth.js";
import ErrorHandler from "../utils/error.js";

export const createOrder = asyncErrorHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentMethod,
    paymentInfo,
    totalAmount,
    shippingCharges,
  } = req.body;

  await Order.create({
    user: req.user && req.user._id,
    shippingInfo,
    orderItems,
    paymentMethod,
    paymentInfo,
    totalAmount,
    shippingCharges,
  });

  orderItems.forEach(async (item) => {
    const product = await Product.findById(item.product);
    product.stock -= item.quantity;
    await product.save();
  });

  res.status(201).json({
    sucess: true,
    message: "Order placed, Thank you!",
  });
});

export const getMyOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});


// single order details 
export const myOrder = asyncErrorHandler(async (req,res,next) => {
  const id = req.params.id

  const order = await Order.findOne({_id: id}).populate("orderItems.product" , "description")

  if(!order) return next(ErrorHandler("No Such Order" , 400))

  res.status(200).json({
    success: true,
    order,
  })
})