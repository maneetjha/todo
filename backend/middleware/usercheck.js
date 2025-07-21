const {UserModel, TodoModel} = require("../db/db");
const jwt=require('jsonwebtoken')
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

async function usercheck(req,res,next){
    const email=req.body.email
    const password=req.body.password 
    const check=await UserModel.findOne({email:email,password:password})
   
    if(check){
        const token=jwt.sign({
            id:check._id
        },JWT_SECRET)
        req.token=token
       next()
  
    }

    else{ 
        res.json(
            {"msg":"Invalid Credentials"}
        )
    }
}



module.exports=usercheck                