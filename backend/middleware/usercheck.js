const {UserModel, TodoModel} = require("../db/db");
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt');
require('dotenv').config();
const { z }=require('zod') 
const JWT_SECRET = process.env.JWT_SECRET;

async function usercheck(req,res,next){

    const email=req.body.email
    const password=req.body.password 

    const userinfo=await UserModel.findOne({email:email})

    bcrypt.compare(password, userinfo.password, (err, response) => {
        if (err) {
                res.json(
                    {"msg":"Error occurred during password check"}
                )
                return;
        }
        if (response) {
            const token=jwt.sign({
                id:userinfo._id
            },JWT_SECRET)
            req.token=token
            next()
        }
        else {
        res.json({ msg: "Invalid Credentials" });
    }
    });
    
}



module.exports=usercheck                