const express = require("express");
const getValues = require("../controllers/heatMapController.js");

const heatMapRouter = express.Router();

heatMapRouter.get("/heatMap/:id",getValues);

module.exports = heatMapRouter;