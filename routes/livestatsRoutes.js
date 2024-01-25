const express = require("express");
const livestatsController = require("../controllers/livestatsController.js");
const verifyToken = require("../utils/verifyToken.js");

const { getLivestat, getLivestatById, getLivestatByIdandDate, updateLivestat, updateLivestat2, updateStatusStores  } = livestatsController;
const { verifyAccessToken } = verifyToken;

const livestatsRoutes = express.Router();

livestatsRoutes.get("/livestats", getLivestatById);
livestatsRoutes.post("/Update", updateLivestat);
livestatsRoutes.post("/Update2", updateLivestat2);
livestatsRoutes.get("/livestats2", getLivestat);
livestatsRoutes.get("/SumData", getLivestatByIdandDate);
livestatsRoutes.post("/statusStores", updateStatusStores);

module.exports = livestatsRoutes;
