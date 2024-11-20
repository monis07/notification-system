import dotenv from 'dotenv'
dotenv.config()

import jwt from 'jsonwebtoken'
const SECRET = process.env.JWT_SECRET

export default function authenticateJwt(req,res,next){
    const token = req.headers.authorization;
    console.log(token)
    if(token){
        jwt.verify(token,SECRET,(err,user)=>{
            if(err){
                res.status(401).send("Something went wrong while verifying the token")
            }
            else{
                console.log("user from middleware", user)
                req.user = user
                next();
            }
        })
    }else{
        res.send("Unauthorised access!")
    }

}