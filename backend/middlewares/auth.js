import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

//check if user is authenticated or not
export const isAuthentictedUser = catchAsyncError(async (req, res, next) =>{
    const {token } =  req.cookies;
    
    if(!token){
        return  next(new ErrorHandler("Login first to access this resource",401));
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    
    req.user = await User.findById(decoded.id);
    next();
    
});