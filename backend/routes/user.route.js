const express = require("express");
const userControllers = require("../controllers/userController.js");

const userRouter = express.Router();

userRouter.get("/allUser",userControllers.getAlluser);
userRouter.get("/userProfile/:id",userControllers.getUserProfile);
userRouter.post("/login",userControllers.login);
userRouter.post("/signup",userControllers.signup);
userRouter.put("/updateProfile/:id",userControllers.updateUserProfile);
userRouter.delete("/deleteProfile/:id",userControllers.deleteUserProfile);

module.exports = userRouter;


