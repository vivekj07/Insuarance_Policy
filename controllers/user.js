import { jwtSecret } from "../app.js"
import { ErrorHandler } from "../middlewares/error.js"
import { User } from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const newUser=async (req,res,next)=>{
    try{
        const {name,email,mobile,username,password}=req.body
    if(!name || !email|| !mobile || !username || !password) return next(new ErrorHandler("Please Enter all Fields",400))
    const user=await User.create({
        name,email,mobile,username,password
    })

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    }
    const token=jwt.sign({_id:user._id},jwtSecret)
    return res.status(200).cookie("user_token",token,cookieOptions).json({
        success:true,
        message:`Welcome ${user.name}`,
        user
    })
    }catch(err){
        next(err)
    }
    
}
export const updateProfile=async (req,res,next)=>{
    try{
        const {name,email,mobile,username,password}=req.body

        const user= await User.findById(req.userId);

        if(!user) return next(new ErrorHandler("User Not Found",400));

        user.name=name;
        user.email=email;
        user.mobile=mobile;
        user.username=username;
        user.password=password

        await user.save()
        
        return res.status(200).json({
        success:true,
        message:"Profile Updated Successfully"
        })
    }catch(err){
        next(err)
    }
    
}

export const login=async (req,res,next)=>{
    try{
        const {username,password}=req.body
        if (!username || !password) return next(new ErrorHandler("Please Enter all fields", 400))

        const user=await User.findOne({
            username
        }).select(["password","name","role"])


        if(!user) return next(new ErrorHandler("Invalid Username",400))

        const isValid=await bcrypt.compare(password,user.password)

        if(!isValid) return next(new ErrorHandler("Invalid Password",400))
        
            const cookieOptions = {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 24 * 60 * 60 * 1000
            }
            const token=jwt.sign({_id:user._id},jwtSecret)
            return res.status(200).cookie("user_token",token,cookieOptions).json({
                success:true,
                message:`Welcome back ${user.name}`,
                user
            }
        )
    }catch(err){
        next(err)
    }
    
}

export const getMyProfile=async (req,res,next)=>{
    try{
        const id=req.userId
        console.log("id",id)
        const user=await User.findById(id)

        if(!user) return next(new ErrorHandler("User Not Found",400))
        
        return res.status(200).json({
            success:true,
            user
        }   
        )
    }catch(err){
        next(err)
    }
    
}

export const logout=async (req,res,next)=>{
    try{
        
        
            const cookieOptions = {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 24 * 60 * 60 * 1000
            }
            return res.status(200).cookie("user_token","",cookieOptions).json({
                success:true,
                message:`Logged Out Succesfully`
            }
        )
    }catch(err){
        next(err)
    }
    
}