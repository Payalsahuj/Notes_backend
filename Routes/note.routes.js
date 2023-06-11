const express=require("express")
const { auth } = require("../middleware/auth.middleware")
const { noteModel } = require("../models/node.model")

const noteRouter=express.Router()

noteRouter.use(auth)

noteRouter.post("/create",async(req,res)=>{
    try{
        const note=new noteModel(req.body)
        await note.save()
        res.json({msg:"New note added",note:req.body})
    }
    catch(err){
        res.json({error:err.message})
    }
})

noteRouter.get("/",async(req,res)=>{
    console.log(req.body)
    try{
        const notes=await noteModel.find({userID:req.body.userID})
        res.send(notes)
    }
    catch(err){
        res.json({error:err.message})
    }
})

noteRouter.patch("/update/:noteID",async(req,res)=>{
    const userIDinUserDoc=req.body.userID
    const {noteID}=req.params
    try{
        const note=await noteModel.findOne({_id:noteID})
        const userIDinNoteDoc=note.userID
        if(userIDinNoteDoc===userIDinUserDoc){
            console.log("userID in User Doc",userIDinUserDoc,"userID in Note Doc",userIDinNoteDoc)
            await noteModel.findByIdAndUpdate({_id:noteID},req.body)
            res.json({msg:`${note.title} has been updated`,update:req.body})
            
        }
        else{
            res.json({msg:"Not Authorized"})
        }
    }
    catch(err){
        res.json({error:err.message})
    }
    
})

noteRouter.delete("/delete/:noteID",async(req,res)=>{
    const userIDinUserDoc=req.body.userID
    const {noteID}=req.params
    try{
        const note=await noteModel.findOne({_id:noteID})
        const userIDinNoteDoc=note.userID
        if(userIDinNoteDoc===userIDinUserDoc){
            console.log("userID in User Doc",userIDinUserDoc,"userID in Note Doc",userIDinNoteDoc)
            await noteModel.findByIdAndDelete({_id:noteID})
            res.json({msg:`${note.title} has been deleted`})
            
        }
        else{
            res.json({msg:"Not Authorized"})
        }
    }
    catch(err){
        res.json({error:err.message})
    }  
})

module.exports={
    noteRouter
}