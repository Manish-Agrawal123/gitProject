const fs = require("fs/promises");
const path = require("path");
const { json } = require("stream/consumers");

const {v4 :uuidv4} = require("uuid");

async function commitRepo(message) {
    const repopath = path.resolve(process.cwd(),".apnaGit");
    const stagedPath = path.join(repopath,"staging");
    const commitPath = path.join(repopath,"commits")

    const commitId = uuidv4();
    const commitDir = path.join(commitPath,commitId);

    try{
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
        console.log(`commit succcesful ${commitId}`)
    }catch(err){
        console.error(err);
    }


}

module.exports = commitRepo;