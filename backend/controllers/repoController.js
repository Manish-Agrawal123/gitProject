const mongoose = require("mongoose");
const User = require("../models/userModel");
const Reposatory = require("../models/repoModel");
const Issue = require("../models/issueModel");
const path = require("path");

const createReposatory = async (req, res) => {
    const { id } = req.params;
    const { name, description, content, visibility } = req.body;
    try {
        if (!name) {
            return res.status(400).json({
                message: "Name does not exist"
            });
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid user id"
            });
        }
        const newReposatory = new Reposatory({
            name,
            owner: id,
            description,
            content,
            visibility,
        });
        const result = await newReposatory.save();

        // Find the user
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        // Add repository id to user's repositories
        user.reposatory.push(result._id);

        // Save updated user
        await user.save();

        res.status(201).json({
            message: "new reposatory created",
            userId: result._id,
        });

    } catch (err) {

        console.error("error in create Reposatory", err);

        res.status(500).json({
            message: "error in creating the repo"
        });
    }
};

const getAllreposatory = async (req,res)=>{
    try{
        const result = await Reposatory.find({}).populate("owner", "username avatar");
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
    const userId = req.params.id;
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

const deleteReposatory = async (req,res)=>{
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

const repoFiles = async (req,res) =>{
    const repoId = req.params.id;
    try{

        const fetchrepo = await Reposatory.findById(repoId);
        if(!fetchrepo){
            res.status(400).json("Reposatory not found");
            return;
        }
        const params = {
            Bucket: S3_BUCKET,
            Prefix: `${repoId}/commits/${fetchrepo.currCommitId}/`,
        };

        const data = await s3.listObjectsV2(params).promise();

        const objects = data.Contents;

        const repo = [];

        for(let object of objects){

            const key = object.Key;

            const params = {
                Bucket: S3_BUCKET,
                Key: key
            };

            const fileCont = await s3.getObject(params).promise();

            repo.push({
                fileName:path.basename(key),
                key:key,
                content:fileCont.Body.toString()
            });   
            
        }
        res.json(repo);
    }catch(err){
        console.error("problem in s3 bucket");
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
    repoFiles,
}