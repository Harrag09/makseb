const express = require("express");
const livestatsController = require("../controllers/livestatsController.js");
const verifyToken = require("../utils/verifyToken.js");

const { getLivestat, getLivestatById, getLivestatByIdandDate, updateLivestat, updateLivestat2, updateLivestat3,updateStatusStores ,GetLicence,UpdateLicence } = livestatsController;
const { verifyAccessToken } = verifyToken;

const livestatsRoutes = express.Router();

livestatsRoutes.get("/livestats", getLivestatById);
livestatsRoutes.post("/Update", updateLivestat);
livestatsRoutes.post("/Update2", updateLivestat2);
livestatsRoutes.post("/Update3", updateLivestat3);
livestatsRoutes.get("/livestats2", getLivestat);
livestatsRoutes.get("/SumData", getLivestatByIdandDate);
livestatsRoutes.post("/statusStores", updateStatusStores);
livestatsRoutes.get("/GetLicence/:idCRM", GetLicence);
livestatsRoutes.post("/UpdateLicence/:idCRM/:action", UpdateLicence);
statsRoutes.post("/updateAllCatInFolder", updateAllCatInUploid);
livestatsRoutes.post("/updateAllCatInMongobd", updateAllCatCripteInMongo);

module.exports = livestatsRoutes;
