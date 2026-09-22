const fs = require("fs/promises");
const path = require("path");

async function addRepo(filePath) {
    const repoPath = path.resolve(process.cwd(),".apnaGit");
    const stagingPath = path.join(repoPath,"staging");
    

    try{
        await fs.mkdir(stagingPath,{recursive:true});
        const relativePath = path.relative(
            process.cwd(),
            filePath
        );

        const destination = path.join(
            stagingPath,
            relativePath
        );

        await fs.mkdir(
            path.dirname(destination),
            {
                recursive: true
            }
        );

        await fs.copyFile(
            filePath,
            destination
        );
        console.log(`file ${fileName} added to staging area`);
        
    }catch(err){
        console.error(err);
    }

}

module.exports = addRepo;