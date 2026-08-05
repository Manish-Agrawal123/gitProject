const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const initRepo = require("./controllers/init.js");
const addRepo = require("./controllers/add.js");
const pullRepo = require("./controllers/pull.js");
const pushRepo = require("./controllers/push.js");
const commitRepo = require("./controllers/commit.js");
const revertRepo = require("./controllers/revert.js");

yargs(hideBin(process.argv))
.command("init","Initialize a new Reposatory",{},initRepo)
.command("add <file>","add a new file in reposatory",(yargs)=>{
    return yargs.positional('file',{
        describe:'file to add in the staging area',
        type:"string"
    });
},(argv)=>{
    addRepo(argv.file);
})
.command("pull","pull the repo",{},pullRepo)
.command("push","push the repo",{},pushRepo)
.command("commit <message>","save the repo",(yargs)=>{
    return yargs.positional('message',{
        describe:'write the commit message',
        type:"string"
    });
},(argv)=>{
    commitRepo(argv.message);
})
.command("revert <commitId>","revert back to previous code",(yargs)=>{
    return yargs.positional('commitId',{
        describe:'revert back to this id',
        type:"string"
    });
},revertRepo)
.demandCommand(1,"Atleast one command require")
.help()
.parse()