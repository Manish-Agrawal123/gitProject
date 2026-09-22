const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware.js");
const authorizeRepository = require("../middlewares/authorizeMiddleware.js");

const cliController = require("../controllers/cliController.js");

const cliRouter = express.Router();


// Initialize repository
cliRouter.get(
    "/repo/init/:name",
    authMiddleware,
    cliController.initRepo
);


// Record commit
cliRouter.post(
    "/repo/commit/:id",
    authMiddleware,
    authorizeRepository,
    cliController.commitRepo
);


// Revert repository
cliRouter.post(
    "/repo/revert/:id",
    authMiddleware,
    authorizeRepository,
    cliController.revertRepo
);


module.exports = cliRouter;