const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mainRouter = require("./routes/main.route.js");

const {Server} = require("socket.io");

dotenv.config();



const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const initRepo = require("./controllers/init.js");
const addRepo = require("./controllers/add.js");
const pullRepo = require("./controllers/pull.js");
const pushRepo = require("./controllers/push.js");
const commitRepo = require("./controllers/commit.js");
const revertRepo = require("./controllers/revert.js");

yargs(hideBin(process.argv))
.command("start","start the index server",{},startServer)
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
},(argv)=>{
    revertRepo(argv.commitId);
})
.demandCommand(1,"Atleast one command require")
.help()
.parse()

function startServer(){
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(express.json());

    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{console.log("succesfully connected to mongo")})
    .catch((err)=>{ console.error("error in mongo connection:",err)})

    app.use(cors({origin:"*"}));

    app.use("/",mainRouter);

    const httpServer = http.createServer(app);

    const io = new Server(httpServer,{
        cors:{
            origin:"*",
            methods:["GET","POST"],
        }
    });

    let user = "test";

    io.on("connection",(socket)=>{
        socket.on("joinRoom",(userID)=>{
            user = userID;
            console.log("====");
            console.log(user);
            console.log("====");
            socket.join(userID);
        })
    })

    const db = mongoose.connection;

    db.once("open",async()=>{
        console.log("crud operation called");
    })

    httpServer.listen(port,()=>{
        console.log(`server is listen on thr port ${port}`);
    })
}