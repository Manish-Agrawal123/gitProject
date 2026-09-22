const mongoose = require("mongoose");
const User = require("../models/userModel");
const Reposatory = require("../models/repoModel");
const Issue = require("../models/issueModel");
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-cnfig");

const createReposatory = async (req, res) => {
    const id = req.user.userId;
    const { name, description, visibility } = req.body;
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
    const userId = req.user.userId;
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

const repoFiles = async (req, res) => {
    const repoId = req.params.id;

    try {
        const userId = req.user.userId;

        const fetchrepo = await Reposatory.findById(repoId).populate("owner");

        if (!fetchrepo) {
            return res.status(400).json("Reposatory not found");
        }

        if (!fetchrepo.currCommitId) {
            return res.status(200).json([]);
        }

        if (!fetchrepo.visibility) {
            if (userId.toString() !== fetchrepo.owner._id.toString()) {
                return res.status(403).json({
                    message: "This repository is private"
                });
            }
        }

        const params = {
            Bucket: S3_BUCKET,
            Prefix: `${repoId}/commits/${fetchrepo.currCommitId}/`,
        };

        const data = await s3.listObjectsV2(params).promise();

        const objects = data.Contents || [];

        const repo = [];

        for (let object of objects) {

            const key = object.Key;

            if (path.basename(key) === "commit.json") continue;

            const params = {
                Bucket: S3_BUCKET,
                Key: key
            };

            const fileCont = await s3.getObject(params).promise();

            repo.push({
                fileName: path.basename(key),
                key: key,
                encoding: fileCont.Body.includes(0) ? "base64" : "utf8",
                content: fileCont.Body.toString(
                    fileCont.Body.includes(0) ? "base64" : "utf8"
                )
            });
        }

        return res.json(repo);

    } catch (err) {
    console.error("Error fetching files:", err);

    if (err.response?.status === 403) {
        setError("This repository is private.");
    } else {
        setError(
            err.response?.data?.message ||
            "Unable to fetch repository files."
        );
    }
}
};

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