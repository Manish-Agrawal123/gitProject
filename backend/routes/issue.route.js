const express = require("express");
const issueControlers = require("../controllers/issueController.js");

const issueRouter = express.Router();

issueRouter.post("/issue/create",issueControlers.createIssue);
issueRouter.put("/issue/update/:id",issueControlers.updateIssue);
issueRouter.delete("/issue/delete/:id",issueControlers.deleteIssue);
issueRouter.get("/issue/all/:id",issueControlers.getAllIssueByRepo);
issueRouter.get("/issue/:id",issueControlers.getIssueById);

module.exports = issueRouter;