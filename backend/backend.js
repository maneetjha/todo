require('dotenv').config();
const express=require('express')
const { z }=require('zod') 

const bcrypt = require('bcrypt');
const path=require('path')
const mongoose=require('mongoose')
const {UserModel, TodoModel} = require("./db/db");
const mongourl=process.env.MONGO_URL
mongoose.connect(mongourl)
const usercheck = require('./middleware/usercheck');
const auth=require('./middleware/authentication')

const app =express()
app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend')));



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const usersignupschema = z.object({
    name: z.string().min(2).max(30), 
    email: z.string().email(),       
    password: z.string().min(6),     
  });


app.post("/signup",async(req,res) =>{
    const email=req.body.email
    const name=req.body.name
    const password=req.body.password 
    const user = req.body;

    const result = usersignupschema.safeParse(user); 
    if (!result.success) {
        const error = result.error.issues[0].message;
        return res.status(400).json({ msg: error });
    }

    const hashedPassword = await bcrypt.hash(password, 5);


    try{
       await UserModel.create({
            email:email,
            name:name,
            password:hashedPassword
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


app.post("/todo",auth,async(req,res) =>{
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



app.get("/todo",auth,async(req,res) =>{
    const userid=req.userid
    const todo=await TodoModel.find({userID:userid})
    res.json({"todo":todo})
   
})  

app.delete("/todo",auth,async(req,res) =>{
    const todoid = req.body.todoid;

    if (!todoid) {
        return res.status(400).json({ msg: "Todo ID is required in body" });
    }

    try {
        const result = await TodoModel.deleteOne({ _id: todoid });

        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: "Todo not found or already deleted" });
        }

        return res.status(200).json({ msg: "Todo deleted successfully" });
    } 
    catch (err) {
        console.error("Error deleting todo:", err);
        return res.status(500).json({ msg: "Server error", error: err.message });
    }
}
)






app.listen(3000 ,console.log("SERVER IS RUNNING ON PORT 3000"))