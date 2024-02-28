const express = require("express");
const livestatsController = require("../controllers/livestatsController.js");
const verifyToken = require("../utils/verifyToken.js");

const {getLivestatByIdandDate2,getAllCatInUploid,updateLivestat4,updateAllCatCripteInMongo,updateAllCatInUploid, getLivestat, getLivestatById, getLivestatByIdandDate, updateLivestat, updateLivestat2, updateLivestat3,updateStatusStores ,GetLicence ,UpdateLicence} = livestatsController;
const { verifyAccessToken } = verifyToken;

const livestatsRoutes = express.Router();

livestatsRoutes.get("/livestats", getLivestatById);
livestatsRoutes.post("/Update", updateLivestat);
livestatsRoutes.post("/Update2", updateLivestat2);
livestatsRoutes.post("/Update3", updateLivestat3);
livestatsRoutes.post("/Update4", updateLivestat4);

livestatsRoutes.get("/livestats2", getLivestat);
livestatsRoutes.get("/SumData", getLivestatByIdandDate);
livestatsRoutes.get("/SumData2", getLivestatByIdandDate2);
livestatsRoutes.post("/statusStores", updateStatusStores);
livestatsRoutes.get("/GetLicence/:idCRM", GetLicence);
livestatsRoutes.get("/UpdateLicence/:idCRM/:action", UpdateLicence);
livestatsRoutes.post("/updateAllCatInFolder", updateAllCatInUploid);
livestatsRoutes.post("/updateAllCatInMongobd", updateAllCatCripteInMongo);
livestatsRoutes.get("/GetImages", getAllCatInUploid);
module.exports = livestatsRoutes;
