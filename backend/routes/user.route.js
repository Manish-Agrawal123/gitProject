const express = require("express");
const userControllers = require("../controllers/userController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

const userRouter = express.Router();

userRouter.get("/allUser",userControllers.getAlluser);
userRouter.get("/userProfile",authMiddleware,userControllers.getUserProfile);
userRouter.post("/login",userControllers.login);
userRouter.post("/signup",userControllers.signup);
userRouter.put("/updateProfile",authMiddleware,userControllers.updateUserProfile);
userRouter.delete("/deleteProfile",authMiddleware,userControllers.deleteUserProfile);
userRouter.patch("/star/:id",authMiddleware,userControllers.updateStarRepo);

module.exports = userRouter;


