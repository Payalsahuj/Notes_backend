const express=require("express")
const bcrypt=require("bcrypt")
require("dotenv").config()
const { userModel } = require("../models/user.model")
const jwt=require("jsonwebtoken")
const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
    const {name,email,pass}=req.body
    try{
        bcrypt.hash(pass,5,async(err,hash)=>{
            if(err){
                res.json({error:err.message})
            }
            else{
                const user=new userModel({name,email,pass:hash})
                await user.save()
            }
        })
        res.json({msg:"User has been registered"})
    }
    catch(err){
        res.json({error:err.message})

    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,pass}=req.body
    try{
        const user=await userModel.findOne({email})
        if(user){
            
            bcrypt.compare(pass,user.pass,(err,result)=>{
                if(result){
                    let token=jwt.sign({userID:user._id,user:user.name},process.env.secode)
                    res.json({msg:"Logged in !!",token})
                }
                else{
                    res.json({error:"Wrong password"})
                }
            })
        }
        else{
            res.json({msg:"User does not exist"})
        }
    }
    catch(err){
        res.json({error:err.message})

    }
    
})

module.exports={
    userRouter
}



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3Vyc2UiOiJCRSIsImlhdCI6MTY4NjA2ODgyMn0.nb0C0Gbz0-0tZ2oLY5S8cDSwQobwuOsWOUocs1Z4pkc