const express = require("express");
const repoControllers = require("../controllers/repoController.js");

const repoRouter = express.Router();

repoRouter.get("/repo/all",repoControllers.getAllreposatory);
repoRouter.post("/repo/create/:id",repoControllers.createReposatory);

repoRouter.get("/repo/name/:name",repoControllers.fetchRepoByName);
repoRouter.get("/repo/user/:userId",repoControllers.fetchRepoCurrUser);

repoRouter.get("/repo/:id",repoControllers.fetchRepoById);

repoRouter.put("/repo/update/:id",repoControllers.updateReposatory);
repoRouter.patch("/repo/toggle/:id",repoControllers.toggleReposatory);
repoRouter.delete("/repo/delete/:id",repoControllers.deleteReposatory);

module.exports = repoRouter;

