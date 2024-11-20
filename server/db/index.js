import mongoose from "mongoose"

const buyerSchema = mongoose.Schema({
    email : String,
    password : String,
    setPreferences : Boolean,
    productPreferences : [String],
    pricePreferences :{
        minimum : Number,
        maximum : Number
    },
    products : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
})

const sellerSchema = mongoose.Schema({
    email : String,
    password : String,
    products : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
})

const productSchema = mongoose.Schema({
    title : String,
    description : String,
    imageLink : String,
    price : Number,
    category : String,
    sellerId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller'
    },
    interestedBuyers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer'
    }]
})

export const Buyer = new mongoose.model('Buyer',buyerSchema)
export const Seller = new mongoose.model('Seller',sellerSchema)
export const Product = new mongoose.model('Product',productSchema)