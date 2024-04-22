import catchAsyncErrors from "../middlewares/catchAsyncError.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";

//create new order => /api/v1/orders/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo
    } = req.body;

    const order =  await Order.create({orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user:req.user._id,
    });

    res.status(201).json({
        order 
    })
});
 
//Get order details => /api/v1/orders/:id
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("No order found with this id",404));
    }
    res.status(201).json({
        order 
    })
});
 
//Get current user orders => /api/v1/me/orders
export const myorders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({user : req.user._id}).populate("user", "name email");

    res.status(201).json({
        orders 
    })
});