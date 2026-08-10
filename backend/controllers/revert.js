const fs = require('fs/promises');
const path = require("path");


async function revertRepo(commitId) {
    const repoPath = path.resolve(process.cwd(),".apnaGit");
    const commitsPath = path.join(repoPath,"commits");
    try{
        const commitDir = path.join(commitsPath,commitId);
        const files = await fs.readdir(commitDir);
        const parDir = path.join(repoPath,"..");

        for(let file of files){
            await fs.copyFile(path.join(commitDir,file),path.join(parDir,file));
        }

        console.log(`the folder is sucsessfully revert back ${commitId}`);
    }catch(err){
        console.error(" Cannot revert back",err);
    }
}

module.exports = revertRepo;