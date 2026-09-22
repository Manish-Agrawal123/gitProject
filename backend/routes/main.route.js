const express = require("express");

const mainRouter = express.Router();

const userRouter =
    require("./user.route.js");

const repoRouter =
    require("./repo.route.js");

const issueRouter =
    require("./issue.route.js");

const heatRouter =
    require("./heatMap.js");

const pullpushRouter =
    require("./pull&push.route.js");

const cliRouter =
    require("./cli.route.js");


mainRouter.use(userRouter);

mainRouter.use(repoRouter);

mainRouter.use(issueRouter);

mainRouter.use(heatRouter);

mainRouter.use(pullpushRouter);

mainRouter.use(cliRouter);


mainRouter.get("/", (req, res) => {
    res.send("hello");
});


module.exports = mainRouter;