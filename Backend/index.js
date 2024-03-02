const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { error } = require('console');

app.use(express.json());
app.use(cors());

// username Ayush
// password GaQx4P1O2DzcskHF

// Database connection with db

mongoose.connect("mongodb+srv://Ayush:GaQx4P1O2DzcskHF@cluster0.wrs7p9c.mongodb.net/e-commerce");

// API Cration
app.get('/',(req,res)=>{
    res.send('Express app is running');
})

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

// Creating upload endpoint for images
app.use('/images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for products

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required: true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    new_price:{
        type: Number,
        required: true,
    },
    old_price:{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    available:{
        type: Boolean,
        default: true,
    },
})
// Schema Creation for user model;

const Users = mongoose.model('Users',{
    name:{
        type: String,
    },
    email:{
        type: String,
        unique: true,
    },
    password:{
        type: String,
    },
    cartData:{
        type: Object,
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

// Creating endpoint for registering the user
app.post('/signup',async(req,res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false, errors:"Enter a unique email id"});
    }
    let cart = {};
    for(let i = 0; i<300; i++){
        cart[i] = 0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true, token})

})

// Creating endpoint for user login

app.post('/login',async(req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret-ecom');
            res.json({success:true, token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email"})
    }
})


// API for adding  products;
app.post('/addproduct', async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log('Saved');
    res.json({
        success: true,
        name: req.body.name,
    })
})
// API for removing products
app.post('/removeproducts',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log('removed');
    res.json({
        success:true,
        name: req.body.name,
    })
})
// API for getting all products
app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    console.log("ALl products Fetched");
    res.send(products);
})

// endpoint for new collection
app.get('/newcollections',async(req,res)=>{
    let products = await Product.find({});
    let newcollections = products.slice(1).slice(-8);
    res.send(newcollections);
})

// endpoint for popular in women
app.get('/popular_in_women',async(req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    res.send(popular_in_women);
})
// endpoint for related products
app.get('/related_products',async(req,res)=>{
    
})

// creating middleware to fetch user
    const fetchuser = async(req,res,next)=>{
        const token = req.header('auth-token');
        if(!token){
            res.status(401).send({errors:'Please authenticate using valid token'});
        }else{
            try{
                const data = jwt.verify(token,'secret-ecom');
                req.user = data.user;
                next();
            }catch(error){
                res.status(401).send({errors:"Please authenticate using a valid token"});
            }
        }
    }
// endpoint for adding product in cartdata
app.post('/addToCart',fetchuser,async(req,res)=>{
    //console.log(req.body,req.user);
    console.log("Added", req.body.itemId);
    let userData = await Users.findOne({_id: req.user.id})
    userData.cartData[req.body.itemId] +=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Added")
})
// endpoint to remove product from cart 
app.post('/removefrom_cart',fetchuser, async(req,res)=>{
    console.log("removed", req.body.itemId);
    let userData = await Users.findOne({_id: req.user.id})
    if(userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("Removed")
})
// creating endpoint to get cart data
app.post('/getcart',fetchuser,async(req,res)=>{
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})
app.listen(port, (error)=>{
    if(!error){
        console.log("server Running on Port "+port)
    }
    else{
        console.log("Error "+error)
    }
});