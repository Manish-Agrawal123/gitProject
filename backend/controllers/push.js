const fs = require('fs/promises');
const path = require("path");

const {s3,S3_BUCKET} = require('../config/aws-cnfig');


async function pushRepo() {
    const repoPath = path.resolve(process.cwd(),".apnaGit");
    

    const data = await fs.readFile(`${repoPath}/config.json`);
    
    const repoId = JSON.parse(data).repoId;
    
    const repoIdPath = path.join(repoPath,`${repoId}`);
    const commitsPath = path.join(repoIdPath,"commits");

    try{
        const commitDirs = await fs.readdir(commitsPath);
        for(let commitDir of commitDirs){
            const commitPath = path.join(commitsPath,commitDir);
            const files = await fs.readdir(commitPath);
            for(let file of files){
                const filePath = path.join(commitPath,file);
                const fileContent = await fs.readFile(filePath);
                const param = {
                    Bucket:S3_BUCKET,
                    Key:`${repoId}/commits/${commitDir}/${file}`,
                    Body:fileContent,
                }
                await s3.upload(param).promise();
            }
        }

        console.log("All the files are succesfully pushed");
    }catch(err){
        console.error("Error in s3 bucket :",err);
    }
}

module.exports = pushRepo;