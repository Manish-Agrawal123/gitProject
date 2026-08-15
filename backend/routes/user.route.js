const express = require("express");
const userControllers = require("../controllers/userController.js");

const userRouter = express.Router();

userRouter.get("/allUser",userControllers.getAlluser);
userRouter.get("/userProfile",userControllers.getUserProfile);
userRouter.post("/login",userControllers.login);
userRouter.post("/signup",userControllers.signup);
userRouter.put("/updateProfile",userControllers.updateUserProfile);
userRouter.delete("/deleteProfile",userControllers.deleteUserProfile);

module.exports = userRouter;


