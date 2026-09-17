const mongoose = require("mongoose");
const User = require("../models/userModel");
const Reposatory = require("../models/repoModel");

const fs = require('fs/promises');
const path = require("path");

const {S3_BUCKET} = require('../config/aws-cnfig');

async function initRepo() {
    const repoPath = path.resolve(process.cwd(),".apnaGit");
    const currPath = process.cwd();

    try{

        const repo = await Reposatory.findOne({name:path.basename(currPath)});
        if(!repo){
            console.error("first create a reposatory of same name");
            return;
        }

        const repoId = repo._id;

        const repoIdPath = path.join(repoPath,`${repoId}`);
        const commitPath = path.join(repoIdPath,"commits");

        await fs.mkdir(repoPath,{recursive:true});
        await fs.mkdir(repoIdPath,{recursive:true});
        await fs.mkdir(commitPath,{recursive:true});
        await fs.writeFile(
            path.join(repoPath,"config.json"),
            JSON.stringify({bucket:S3_BUCKET,
                repoId:repoId,
            }),
        );
    }catch(err){
        console.error("File was not initialised",err);
    }
}

module.exports = initRepo;