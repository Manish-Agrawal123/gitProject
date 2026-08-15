const express = require("express");

const mainRouter = express.Router();
const userRouter = require("./user.route.js");
const repoRouter = require("./repo.route.js");
const issueRouter = require("./issue.route.js");

mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);

mainRouter.get("/",(req,res)=>{
    res.send("hello");
})

module.exports = mainRouter;
