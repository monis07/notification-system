import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { Buyer, Product, Seller } from '../db/index.js'
import jwt from 'jsonwebtoken'
import authenticateJwt from '../middleware/middleware.js'
import sendWhatsAppMessage from '../twilio/send.js'
const router = express.Router();

const secret = process.env.JWT_SECRET

router.post('/register',async (req,res)=>{
    const {email,password} = req.body
    Buyer.findOne({email:email}).then((buyer)=>{
        if(buyer)
            res.status(400).send("Buyer already exists")
        else{
            const newBuyer = new Buyer({
                email:email,
                password:password
            })
            newBuyer.save().then(()=>{
                res.status(201).send("You are registered successfully! Please Login now to continue")
            }).catch((err)=>{
                res.status(400).send(err)
            })
        }
    })
})

router.post('/login',async (req,res)=>{
    const {email,password} = req.body

    Buyer.findOne({email: email, password: password}).then((buyer)=>{
        if(buyer){
            const token = jwt.sign({email:email, _id : buyer._id},secret)
            res.status(200).json({msg:"Login successful",token:token,setPreferences:buyer.setPreferences})
        }
        else{
            res.status(401).send("Invalid credentials")
        }
    })
})

router.post('/setPreferences', authenticateJwt, async(req,res)=>{
    const {productPreferences, pricePreferences} = req.body

    console.log(productPreferences, pricePreferences)

    try {
        const updated = await Buyer.findOneAndUpdate(
            { email: req.user.email },
            {
                $set: {
                    productPreferences: productPreferences,
                    pricePreferences: {
                        minimum: pricePreferences.minimum,
                        maximum: pricePreferences.maximum
                    },
                    setPreferences: true
                }
            },
            {
                upsert: true,
                new: true
            }
        );
        
        if(updated){
            res.status(200).send("Preferences updated successfully")
        } else {
            res.status(404).send("Buyer not found")
        }
    } catch (error) {
        res.status(400).send("Error updating preferences: " + error.message)
    }
})

router.get('/getPreferences', authenticateJwt, async(req,res)=>{
    try {
        const buyer = await Buyer.findOne({email: req.user.email});
        if (!buyer) {
            return res.status(404).send("Buyer not found");
        }

        if (buyer.products && buyer.products.length > 0) {
            const products = await Product.find({
                _id: { $in: buyer.products }
            }).populate('sellerId','email');
            
            res.status(200).json({ products });
        } else {
            res.status(404).send("No products found");
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching products: " + error.message });
    }
})

router.post('/productInterest/:id',authenticateJwt,async(req,res)=>{
    const productId = req.params.id
    
    await Product.findOneAndUpdate({_id : productId},{$push:{interestedBuyers:req.user._id}})

    sendWhatsAppMessage(req.user.email,`Hey! We are happy to see your interest in our product. Buy now to avail 10% discount!`)

    const product = await Buyer.findOneAndUpdate({_id : req.user._id},{$pull:{products:productId}})

    if(product){
        res.status(200).send("Your interest has been recorded!")
    }
    else{
        res.status(400).send("Error recording interest")
    }
})

router.post('/noproductInterest/:id',authenticateJwt, async(req,res)=>{
    const productId = req.params.id    
    sendWhatsAppMessage(req.user.email,`Hey! We are not happy to see you go. Please let us know how we can improve our product.`)

    const product = await Buyer.findOneAndUpdate({_id : req.user._id},{$pull:{products:productId}})

    if(product){
        res.status(200).send("Your feedback has been recorded!")
    }
    else{
        res.status(400).send("Error recording interest")
    }
})


export default router