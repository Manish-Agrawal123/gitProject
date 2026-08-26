const mongoose = require("mongoose");
const User = require("../models/userModel");
const Reposatory = require("../models/repoModel");
const Issue = require("../models/issueModel");


const createIssue = async (req,res)=>{
    const {id} = req.params;
    const {title,describtion} = req.body;
    try{
        if(!title){
            return res.status(400).json("Title not found");
        }
        const issue = new Issue({
            describtion,
            title,
            reposatory:id,
        })

        const newIssue = await issue.save();

        res.status(200).json({
            message:"Issue succesfully created",
            newIssue,
        })
    }catch(err){
        console.error("error in creating issue");
        res.status(500).json("error in creating issue");
    }
}

const updateIssue = async (req,res)=>{
    const {id} = req.params;
    const {title,describtion,status} = req.body;
    try{
        
        const issue = await Issue.findById(id);

        if(!issue){
            return res.status(404).json("Issue not found");
        }

        issue.title = title;
        issue.describtion = describtion;
        issue.status = status;

        const newIssue = await issue.save();

        res.status(200).json({
            message:"Issue succesfully updated",
            newIssue,
        })
    }catch(err){
        console.error("error in updating issue");
        res.status(500).json("error in updating issue");
    }
}

const deleteIssue = async (req,res)=>{
    const {id} = req.params;
    try{
        const issue = await Issue.findByIdAndDelete(id);

        if(!issue){
            return res.status(404).json("Issue not found");
        }

        res.status(200).json({
            message:"Issue succesfully deleted",
            issue,
        })
    }catch(err){
        console.error("error in deleting issue");
        res.status(500).json("error in deleting issue");
    }
}

const getAllIssueByRepo = async (req,res)=>{
    const {id} = req.params;
    try{
        const issues = await Issue.find({reposatory:id});

        if( issues.length == 0){
            return res.status(404).json("Issues not found");
        }

        res.status(200).json({
            message:"Issue succesfully fetched",
            issues,
        })

    }catch(err){
        console.error("error in fetching issue");
        res.status(500).json("error in fetching issue");
    }
}

const getIssueById = async (req,res)=>{
    const {id} = req.params;
    try{
        const issue = await Issue.findById(id);

        if(!issue){
            return res.status(404).json("Issue not found");
        }

        res.status(200).json({
            message:"Issue succesfully fetched",
            issue,
        })

    }catch(err){
        console.error("error in fetching issue");
        res.status(500).json("error in fetching issue");
    }
}

module.exports = {
    createIssue,
    updateIssue,
    deleteIssue,
    getAllIssueByRepo,
    getIssueById,
}