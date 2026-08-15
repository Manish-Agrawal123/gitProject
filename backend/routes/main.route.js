const express = require("express");

const mainRouter = express.Router();
const userRouter = require("./user.route.js");

mainRouter.use(userRouter);

mainRouter.get("/",(req,res)=>{
    res.send("hello");
})

module.exports = mainRouter;
