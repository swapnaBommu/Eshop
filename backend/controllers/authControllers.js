import catchAsyncErrors from "../middlewares/catchAsyncError.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
 
//Register User =>/api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) =>{
    const {name, email, password} = req.body;

    const user = await User.create({ name, email, password});
    sendToken(user,201,res);
});

//Login User =>/api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) =>{
    const {email, password} = req.body;
    if(!email || !password) {
        return next(new ErrorHandler("Please enter email & password",400))
    }

    //find user in the database
    const user = await User.findOne({ email }).select("+password");

    if(!user) {
        return next(new ErrorHandler("Invalid email or password",401));
    }
    //check if password is correct 
    const isPasswordMatched = await user.comparePassword(password);
    
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    sendToken(user,200,res);
});

//logout user ---> /api/v1/logout
export const logout = catchAsyncErrors(async (req, res, next) =>{
    res.cookie("token",null, {
        expires : new Date(Date.now()),
        httpOnly : true
    });
    res.status(200).json({
        message:"Logged Out"
    })
})


// Forgot password =>  /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async(req, res, next) => {
 
    //Find user in the database
    const user = await User.findOne({email: req.body.email});
 
    if(!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }
 
    //Get reset password token
    const resetToken =  user.getResetPasswordToken()
 
    await user.save();
 
    // Create  reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;
    console.log("***reseturl",resetUrl);
    const message = getResetPasswordTemplate(user?.name, resetUrl);
 
    try {
        await sendEmail({
            email: user.email,
            subject: "ShopIT Password Recovery",
            message,
        });
        res.status(200).json({
            message: `Email sent to: ${user.email}`,
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
 
        await user.save();
        return next(new ErrorHandler(error?.message, 500));
    }
});

// Reset password =>  /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(async(req, res, next) => {
 
    //Hash the url Token
    const resetPasswordToken = crypto.createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now()}
    });
    if(!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400));
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Passwords does not match', 400));
    }

    //set the new password
    user.password = req.body.password;
    //set the user password token to undefined
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
 
});

//Get current user  profile --> /api/v1/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) =>{
    
    const user = await User.findById(req?.user?._id);

    res.status(200).json({
        user
    });
});

//Update password --> /api/v1/password/update
export const updatePassword = catchAsyncErrors(async (req, res, next) =>{
    
    const user = await User.findById(req?.user?._id).select("+password");
    
    //check the previous password of the user
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
   
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",400));
    }
    user.password = req.body.password;
    user.save()
    res.status(200).json({
       success:true
    });
});

//Update user profile --> /api/v1/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) =>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user._id, newUserData,{new : true})
    res.status(200).json({
       success:true,
       user
    });
});
