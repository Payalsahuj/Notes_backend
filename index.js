const express=require("express")
const { connection } = require("./db")
const { userRouter } = require("./Routes/user.routes")
const { noteRouter } = require("./Routes/note.routes")
require("dotenv").config()
const cors=require("cors")
const app=express()
app.use(cors())
app.use(express.json())


app.use("/users",userRouter)
app.use("/notes",noteRouter)

app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("Connected to db")
        console.log("port is running at 4500")
    }
    catch(err){
        console.log(err.message)
        console.log("Something went wrong")
    }
})