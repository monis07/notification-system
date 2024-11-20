import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import mongoose from 'mongoose';
import cors from "cors"
import bodyparser from 'body-parser'

import sellerRouter from './routes/seller.js'
import buyerRouter from './routes/buyer.js'

const port =3000
const url=process.env.MONGODB_URL
const app=express();
app.use(express.json());
app.use(bodyparser.json())

app.use(cors()); 

app.use('/seller',sellerRouter)
app.use('/buyer',buyerRouter)

mongoose.connect(url,{dbName:'zoniqx-assignment'})

app.listen(port,()=>{
    console.log("Server is listening on port "+port)
})


