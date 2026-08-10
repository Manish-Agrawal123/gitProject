const fs = require('fs/promises');
const path = require("path");

const {s3,S3_BUCKET} = require('../config/aws-cnfig');

async function pullRepo() {
    const repoPath = path.resolve(process.cwd(),".apnaGit");
    const commitsPath = path.join(repoPath,"commits");

    try{
        const params = {
        Bucket: S3_BUCKET,
        Prefix: "commits",
    };

    const data = await s3.listObjectsV2(params).promise();

    const objects = data.Contents;

    for(let object of objects){
        const key = object.Key;
        const commitDir = path.join(commitsPath,path.dirname(key).split('/').pop());

        await fs.mkdir(path.dirname(filePath), { recursive: true });
        const params = {
            Bucket:S3_BUCKET,
            Key:key
        }

        const fileCont = await s3.getObject(params).promise();
        await fs.writeFile(path.join(repoPath,key),fileCont.Body);
    }
    console.log("All object are pulled");

    }catch(err){
        console.error("problem in s3 bucket");
    }
}

module.exports = pullRepo;