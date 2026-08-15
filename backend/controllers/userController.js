const User = require("../models/userModel.js");
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");


const getAlluser = async (req,res)=>{
    try{

        let users =await User.find({});
        res.json(users);

    }catch(err){
        console.error("error in fetching user data",err);
        res.status(500).json({
            message:"server error"
        });
    }
}

const signup = async (req,res)=>{
    try{
        const {username,email,password} = req.body;
        const existingUser = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        });
        if (existingUser) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username:username,
            email:email,
            password:hash,
            reposatory:[],
            starRepo:[],
            followedUser:[],
        })

        await newUser.save();

        const token = jwt.sign({ userId:newUser._id}, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({
            message:"user Succesfully created",
            token
        });


    }catch(err){
        console.error("error in signup");
        res.status(500).json({
            message:"server error"
        });
    }
}

const login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({
                message: "Invalid credential"
            });
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(401).json({
                message: "Invalid credential"
            });
        }

        const token = jwt.sign({ userId:user._id}, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({
            message:"user Succesfully loggedin",
            token,
            userId:user._id,
        });


    }catch(err){
        console.error("error in login",err);
        res.status(500).json({
            message:"server error"
        });
    }
}

const getUserProfile = async (req,res)=>{
    try{
        const id = req.params.id;

        let user = await User.findById(id);

        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        res.json(user);

    }catch(err){
        console.error("error in fetching user data",err);
        res.status(500).json({
            message:"server error"
        });
    }
}

const deleteUserProfile = async (req,res)=>{
    try{
        const id = req.params.id;

        const user = await User.findByIdAndDelete(id);

        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        res.status(200).json({message:"user succesfully delete"});

    }catch(err){
        console.error("error in delete user",err);
        res.status(500).json({
            message:"server error"
        });
    }
}

const updateUserProfile = async (req,res)=>{
    try{
        const id = req.params.id;
        const {email,password} = req.body;

        const updateField = {};

        if(email){
            updateField.email = email;
        }

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            updateField.password = hash;
        }

        const user = await User.findByIdAndUpdate(id,{$set:updateField},{new:true});

        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        res.status(200).json(user);

    }catch(err){
        console.error("error in update user",err);
        res.status(500).json({
            message:"server error"
        });
    }
}

module.exports = {
    getAlluser,
    login,
    signup,
    updateUserProfile,
    deleteUserProfile,
    getUserProfile,
}