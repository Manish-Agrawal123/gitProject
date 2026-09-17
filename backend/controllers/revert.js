const Reposatory = require("../models/repoModel");
const fs = require('fs/promises');
const path = require("path");


async function revertRepo(commitId) {
    const repoPath = path.resolve(process.cwd(),".apnaGit");
    const data = await fs.readFile(`${repoPath}/config.json`);
        
    const repoId = JSON.parse(data).repoId;
    const repo = await Reposatory.findById(repoId);
    
        
    const repoIdPath = path.join(repoPath,`${repoId}`);
    const commitsPath = path.join(repoIdPath,"commits");

    try{
        const commitDir = path.join(commitsPath,commitId);
        const files = await fs.readdir(commitDir);
        const parDir = path.join(repoPath,"..");

        for(let file of files){
            if(file === "commit.json") continue;

            await fs.copyFile(
                path.join(commitDir,file),
                path.join(parDir,file)
            );
        }

        repo.currCommitId = commitId;
        await repo.save();

        console.log(`the folder is sucsessfully revert back ${commitId}`);
        
    }catch(err){
        console.error(" Cannot revert back",err);
    }
}

module.exports = revertRepo;