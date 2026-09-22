const express = require("express");
const repoControllers = require("../controllers/repoController.js");

const authorizeRepository = require("../middlewares/authorizeMiddleware.js");

const authMiddleware = require("../middlewares/authMiddleware.js");

const repoRouter = express.Router();

repoRouter.get("/repo/all",repoControllers.getAllreposatory);
repoRouter.post("/repo/create",authMiddleware,repoControllers.createReposatory);

repoRouter.get("/repo/name/:name",repoControllers.fetchRepoByName);
repoRouter.get("/repo/user",authMiddleware,repoControllers.fetchRepoCurrUser);

repoRouter.get("/repo/:id",repoControllers.fetchRepoById);

repoRouter.put(
    "/repo/update/:id",
    authMiddleware,
    authorizeRepository,
    repoControllers.updateReposatory
);

repoRouter.patch(
    "/repo/toggle/:id",
    authMiddleware,
    authorizeRepository,
    repoControllers.toggleReposatory
);

repoRouter.delete(
    "/repo/delete/:id",
    authMiddleware,
    authorizeRepository,
    repoControllers.deleteReposatory
);

repoRouter.get("/repo/files/:id",authMiddleware,repoControllers.repoFiles);


module.exports = repoRouter;

