const Reposatory = require("../models/repoModel");
const fs = require("fs/promises");
const path = require("path");

const {v4 :uuidv4} = require("uuid");

const Cotr = require("../models/contributionModel.js");

async function commitRepo(message,userId) {

    const repoPath = path.resolve(process.cwd(),".apnaGit");
    const stagedPath = path.join(repoPath,"staging");

    try{

        const data = await fs.readFile(`${repoPath}/config.json`);

        const repoId = JSON.parse(data).repoId;
        if(!repoId){
            console.log("first initialise the reposatory");
            return;
        }

        const repo = await Reposatory.findById(repoId);

        const repoIdPath = path.join(repoPath,`${repoId}`);
        const commitPath = path.join(repoIdPath,"commits");

        const commitId = uuidv4();
        const commitDir = path.join(commitPath,commitId);

        await fs.mkdir(commitDir,{recursive:true});
        const files = await fs.readdir(stagedPath);
        for(let file of files){
            await fs.copyFile(path.join(stagedPath,file),path.join(commitDir,file));
        }
        await fs.writeFile(
            path.join(commitDir,"commit.json"),
            JSON.stringify({
                message:message,
                date : new Date().toISOString()
            })
        )

        repo.currCommitId = commitId;
        await repo.save();
        
        const cotr = await Cotr.findOne({user:userId});

        const currDate = new Date().toISOString().split("T")[0];

        if(!cotr){
            const newCotr = new Cotr({
                user: userId,
                contribution: [
                    {
                        date: currDate,
                        count: 1,
                    }
                ]
            });
            await newCotr.save();
        }else{
            const result = cotr.contribution.find(item => item.date === currDate);
            if(!result){
                cotr.contribution.push({ date: currDate, count: 1 });
            }else{
                result.count = result.count+1;
            }
            await cotr.save();
        }


        console.log(`commit succcesful ${commitId}`)
    }catch(err){
        console.error(err);
    }
}

module.exports = commitRepo;