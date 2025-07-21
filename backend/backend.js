require('dotenv').config()
const express=require('express')
const zod =require('zod') 
const path=require('path')
const mongoose=require('mongoose')
const {UserModel, TodoModel} = require("./db/db");
const mongourl=process.env.MONGO_URl
mongoose.connect(mongourl)
mongoose.connect("mongodb+srv://maneetjha11:maneet%40mdb%401256@cluster0.pifo4om.mongodb.net/todo-app")

const app =express()
const usercheck = require('./middleware/usercheck');
const todorelation=require('./middleware/todorelation')


app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend')));





app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});



app.post("/signup",async(req,res) =>{
    const email=req.body.email
    const name=req.body.name
    const password=req.body.password 
   
    try{
       await UserModel.create({
            email:email,
            name:name,
            password:password
       })
       res.send("You have been signed up!")
       
   }
   catch(err){
        res.send("Username already exists!")
        
    }
})


app.post("/signin",usercheck,async(req,res) =>{
    const token=req.token
    res.json({"token":token}) 
})


app.post("/todo",todorelation,async(req,res) =>{
    const todo=req.body.todo
    const done=req.body.done
    const userid=req.userid
    const todocreated=await TodoModel.create({
        title: todo,
        done: done,
        userID: userid
    })
    const todoID=todocreated._id
    res.json({"todoID":todoID})
})



app.get("/todo",todorelation,async(req,res) =>{
    const userid=req.userid
    const todo=await TodoModel.find({userID:userid})
    res.json({"todo":todo})
   
})  







app.listen(3000 ,console.log("SERVER IS RUNNING ON PORT 3000"))