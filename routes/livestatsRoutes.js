const express = require("express");
const livestatsController = require("../controllers/livestatsController.js");
const verifyToken = require("../utils/verifyToken.js");

const {generateTicketsHTML2,generateTicketsHTML,getTiquerId,UpdateTiquer,getLivestatByIdandDate2,getAllCatInUploid,updateLivestat4,updateAllCatCripteInMongo,updateAllCatInUploid, getLivestatByIdandDate,   updateLivestat3,updateStatusStores ,GetLicence ,UpdateLicence} = livestatsController;
const { verifyAccessToken } = verifyToken;

const livestatsRoutes = express.Router();

livestatsRoutes.post("/Update3", updateLivestat3);
livestatsRoutes.post("/Update4", updateLivestat4);
livestatsRoutes.post("/UpdateTiquer", UpdateTiquer);

livestatsRoutes.get("/SumData", getLivestatByIdandDate);
livestatsRoutes.get("/SumData2", getLivestatByIdandDate2);
livestatsRoutes.get("/GetTiquer", getTiquerId);

livestatsRoutes.post("/statusStores", updateStatusStores);

livestatsRoutes.get("/GetLicence/:idCRM", GetLicence);
livestatsRoutes.get("/UpdateLicence/:idCRM/:action", UpdateLicence);

livestatsRoutes.post("/updateAllCatInFolder", updateAllCatInUploid);
livestatsRoutes.post("/updateAllCatInMongobd", updateAllCatCripteInMongo);
livestatsRoutes.get("/GetImages", getAllCatInUploid);


livestatsRoutes.get("/AfficheTicket", generateTicketsHTML);
livestatsRoutes.get("/AfficheTicket2", generateTicketsHTML2);

module.exports = livestatsRoutes;
