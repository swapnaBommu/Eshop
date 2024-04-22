import catchAsyncErrors from "../middlewares/catchAsyncError.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
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
    const order = await Order.findById(req.params.id).populate("user", "name email");

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

//Get all orders - ADMIN => /api/v1/admin/orders
export const allorders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();
    res.status(201).json({
        orders 
    })
});

//update order - ADMIN => /api/v1/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("No order found with this id",404));
    }

    if(order?.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order",400));
    }

    //update product stock
    order?.orderedItems?.forEach(async (item) => {
        const product = await Product.findById(item?.product.toString());
        
        if(!product){
            return next(new ErrorHandler("No product found with this id",404));
        }

        product.stock = product.stock - quantity;
        await product.save();
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(201).json({
        success: true 
    })
});

//delete order - admin => /api/v1/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("No order found with this id",404));
    }
    await order.deleteOne();
    
    res.status(201).json({
        success:true
    })
});