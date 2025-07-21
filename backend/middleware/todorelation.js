const jwt=require('jsonwebtoken')
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

function todorelation(req,res,next){
    const authHeader = req.headers.token;

    console.log(authHeader)

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

   
    try {
        const userid = jwt.verify(authHeader, JWT_SECRET);
        req.userid=userid.id; 
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }

}

module.exports=todorelation

