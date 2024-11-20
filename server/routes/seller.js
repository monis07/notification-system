import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { Seller,Buyer, Product } from '../db/index.js'
import jwt from 'jsonwebtoken'
import authenticateJwt from '../middleware/middleware.js'
import sendWhatsappMessage from '../twilio/send.js'
const router = express.Router();

const secret = process.env.JWT_SECRET

router.post('/register',async (req,res)=>{
    const {email,password} = req.body
    Seller.findOne({email:email}).then((seller)=>{
        if(seller)
            res.status(400).send("Seller already exists")
        else{
            const newSeller = new Seller({
                email:email,
                password:password
            })
            newSeller.save().then(()=>{
                res.status(201).send("You are registered successfully! Please Login now to continue")
            }).catch((err)=>{
                res.status(400).send(err)
            })
        }
    })
})

router.post('/login',async (req,res)=>{
    const {email,password} = req.body

    Seller.findOne({email: email, password: password}).then((seller)=>{
        if(seller){
            console.log(seller._id)
            const token = jwt.sign({email:email, _id : seller._id},secret)
            res.status(200).json({msg:"Login successful",token:token})
        }
        else{
            res.status(401).send("Invalid credentials")
        }
    })
})

router.get('/getProducts',authenticateJwt,async(req,res)=>{
    Product.find({sellerId:req.user._id}).then((products)=>{
        res.status(200).json({products})
    }).catch((err)=>{
        res.status(400).send(err)
    })
})

router.post('/addProduct',authenticateJwt,async(req,res)=>{
    const {title,description,imageLink,price,category} = req.body
    const newProduct = new Product({
        title:title,
        description:description,
        image:imageLink,
        price:price,
        category:category,
        sellerId:req.user._id
    })
    console.log("req.user._id",req.user._id);
    newProduct.save().then(async(product)=>{
        res.status(201).send("Product added successfully")

        await Seller.findOneAndUpdate({email : req.user.email}, {$push: {products: product._id}})

        try{
            await Buyer.updateMany({
                $or: [
                    { productPreferences: { $in: [category] } },
                    { 'pricePreferences.minimum': { $lte: price }, 'pricePreferences.maximum': { $gte: price } }
                ]
            },{
                $addToSet: { products: product._id }
            })
        }catch(err){
            console.log("Error while updating buyers",err)
        }
        
        Buyer.find({$or: [
            { productPreferences: { $in: [category] } },
            { 'pricePreferences.minimum': { $lte: price }, 'pricePreferences.maximum': { $gte: price } }
        ]}).then((buyers)=>{
            if(buyers.length === 0){
                console.log("No buyers found")
                return;
            }
            buyers.forEach((buyer)=>{
                buyer.products.push(product._id)
                sendWhatsappMessage(buyer.email,`Hey! A new product in *${category}* category has been added for $${price}. Check it out on our website my logging in with your username and password. Buy in 24 hours to avail 10% discount!`)
            })
        })


    }).catch((err)=>{
        res.status(400).send(err)
    })
})

router.get('/getBuyers/:id',authenticateJwt,async(req,res)=>{
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            console.log("no product found")
            return res.status(404).send("Product not found");
        }

        const buyerEmails = [];

        if(product.interestedBuyers.length === 0){
            console.log("No buyers found")
            return res.status(404).send("No buyers found")
        }

        for (const buyerId of product.interestedBuyers) {
            const buyer = await Buyer.findById(buyerId);
            if (buyer) {
                buyerEmails.push(buyer.email);
            }
        }

        console.log("buyerEmails ->", buyerEmails)

        res.status(200).json({buyerEmails : buyerEmails});
    } catch (err) {
        res.status(500).send("Error fetching buyers: " + err.message);
    }
})

export default router