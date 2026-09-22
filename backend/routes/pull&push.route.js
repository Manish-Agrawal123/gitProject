const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware.js");
const authorizeRepository = require("../middlewares/authorizeMiddleware.js");

const pullpushRouter = express.Router();

const pullController = require("../controllers/pullRepo.js");
const pushController = require("../controllers/pushRepo.js");


// PUSH
pullpushRouter.post(
    "/repo/push/:id",
    authMiddleware,
    authorizeRepository,
    pushController.pushRepo
);


// PULL
pullpushRouter.get(
    "/repo/pull/:id",
    authMiddleware,
    authorizeRepository,
    pullController.pullRepo
);


module.exports = pullpushRouter;