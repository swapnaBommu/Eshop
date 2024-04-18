import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[ true, "Please enter your name"],
        maxLength:[50,'Your name cannot exceed 50 characters'],
    },
    email :{
        type: String,
        required:[ true, "Please enter your email"],
        unique:true,
    },
    password:{
        type: String,
        required:[ true, "Please enter your Password"],
        minLength:[6,'Password must be longer than 6 characters'],
        select:false
    },
    avatar:{
        public_id:String,
        url:String,
    },
    role:{
        type:String,
        default:"user",

    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
},
{timestamps: true}
);

//encrypting the password before saving the user
userSchema.pre('save', async function (next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
});

//return JWT token
userSchema.methods.getJwtToken = function(){
    //creating jwt token
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRES_TIME
    });
};

//compare user password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};
export default mongoose.model("User",userSchema);