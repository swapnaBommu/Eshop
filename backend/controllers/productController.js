import catchAsyncError from "../middlewares/catchAsyncError.js";
import Product from "../models/product.js"
import ErrorHandler from "../utils/errorHandler.js";
import APIFilters from "../utils/apiFilters.js";
//get products => /api/v1/products
export const getProducts = catchAsyncError( async (req,res) =>{
    const resPerPage = 4;
    const apiFilters = new APIFilters(Product,req.query).search().filters()

    let products = await apiFilters.query;
    let filteredProductsCount = products.length;
    
    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone();
    
    res.status(200).json({
        resPerPage,
        filteredProductsCount,
        products
    });
});

//create new product => /api/v1/admin/products
export const newProduct = catchAsyncError(async (req,res) =>{
    const product = await Product.create(req.body)

    res.status(200).json({
        product,
    });
});

//get single product details => /api/v1/products/:id
export const getProductDetails = catchAsyncError(async (req, res, next) =>{
    const product = await Product.findById(req?.params?.id)
    if(!product){
        // return res.status(404).json({
        //     error:"product not found"
        // });
        return next(new ErrorHandler("Product not found",404));
    }
    res.status(200).json({
        product,
    });
});

//update product details => /api/v1/products/:id
export const updateProduct = catchAsyncError(async (req,res, next) =>{
    let product = await Product.findById(req?.params?.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    product = await Product.findByIdAndUpdate(req?.params?.id,req.body,{new:true});
    res.status(200).json({
        product,
    });
});

//delete product details => /api/v1/products/:id
export const deleteProduct = catchAsyncError(async (req,res, next) =>{
    let product = await Product.findById(req?.params?.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

   await product.deleteOne();
    res.status(200).json({
        message:"Product deleted"
    });
});