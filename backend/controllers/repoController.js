const mongoose = require("mongoose");
const User = require("../models/userModel");
const Reposatory = require("../models/repoModel");
const Issue = require("../models/issueModel");

const createReposatory = async (req,res)=>{
    const {id} = req.params;
    const { name,description,content,visibility} = req.body;
    try{

        if(!name){
            return res.status(400).json({message:"Name does not exist"});
        }

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid user id"});
        }

        const newReposatory = new Reposatory({
            name,
            owner:id,
            description,
            content,
            visibility,
        });

        const result = await newReposatory.save();

        res.status(201).json({
            message:"new reposatory created",
            userId:result._id,
        })

    }catch(err){
        console.error("error in create Reposatory",err);
        res.status(500).json({
            message:"erron in creating the repo"
        });
    }
}

const getAllreposatory = async (req,res)=>{
    try{
        const result = await Reposatory.find({});
        res.json(result);

    }catch(err){
        console.error("error in fetching all reposatory",err);
        res.status(500).json({
            message:"error in fetching all reposatory"
        });
    }
}

const fetchRepoById = async (req,res)=>{

    const {id} = req.params;

    try{
        const result = await Reposatory.findById(id).populate("owner").populate("issue");
        if (!result) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }
        res.json(result);

    }catch(err){
        console.error("error in fetching reposatory by id",err);
        res.status(500).json({
            message:"error in fetching reposatory by id"
        });
    }
}

const fetchRepoByName = async (req,res)=>{
    const {name} = req.params;
    try{
        const result = await Reposatory.findOne({name:name}).populate("owner").populate("issue");
        if (!result) {
            return res.status(404).json({
                message: "Repository not found"
            });
        }
        res.json(result);

    }catch(err){
        console.error("error in fetching all reposatory",err);
        res.status(500).json({
            message:"error in fetching all reposatory"
        });
    }
}

const fetchRepoCurrUser = async (req,res)=>{
    const userId = req.user;
    try{
        const result = await Reposatory.find({owner:userId});

        if(!result || result.length == 0){
            return res.status(404).json("Reposatories not found");
        }
        res.json(result);

    }catch(err){
        console.error("error in fetching reposatory",err);
        res.status(500).json({
            message:"error in fetching reposatory"
        });
    }
}

const updateReposatory = async (req,res)=>{
    const {id} = req.params;
    try{
        const {description,content} = req.body;
        const result = await Reposatory.findByIdAndUpdate(id,{
            description,
            content,
        },{ new: true }
        )

        if(!result){
            return res.status(404).json("Reposatories not found");
        }
        res.status(200).json({
            message:"reposatory succesfully updated",
            result,
        });

    }catch(err){
        console.error("error in updating reposatory",err);
        res.status(500).json({
            message:"error in updating reposatory"
        });
    }
}

const toggleReposatory = async (req,res)=>{
    const {id} = req.params;
    try{
        const result = await Reposatory.findById(id);

        if(!result){
            return res.status(404).json("Reposatories not found");
        }

        result.visibility = !result.visibility;
        const updatedRepo = await result.save();
        res.status(200).json({
            message:"reposatory succesfully updated",
            updatedRepo,
        });

    }catch(err){
        console.error("error in visibility",err);
        res.status(500).json({
            message:"error in visibility"
        });
    }
}

const deleteReposatory = (req,res)=>{
    const {id} = req.params;
    try{
        const result = await Reposatory.findByIdAndDelete(id);

        res.status(200).json({
            message:"reposatory succesfully deleted",
            result,
        });

    }catch(err){
        console.error("error in deleting repo",err);
        res.status(500).json({
            message:"error in deleting repo"
        });
    }
}

module.exports = {
    createReposatory,
    fetchRepoById,
    fetchRepoByName,
    fetchRepoCurrUser,
    updateReposatory,
    toggleReposatory,
    deleteReposatory,
    getAllreposatory,
}