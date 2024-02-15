const { connectToDatabase, client } = require('../config/dbConfig.js');


const { ObjectId } = require('mongodb');

const getLivestat = async (req, res) => {
  const idCRM = req.query.idCRM;

  try {
    const db = await connectToDatabase();
    const collection = db.collection('livestats');

    const livestatArray = await collection.find({ IdCRM: idCRM }).toArray();

    if (livestatArray.length === 0) {
      return res.status(404).json({ error: "Livestat not found" });
    }

    res.json(livestatArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getLivestatById = async (req, res) => {
  const idCRM = req.query.idCRM;

  try {
    const db = await connectToDatabase();
    const collection = db.collection('livestats2');

    const livestat = await collection.findOne({ IdCRM: idCRM });

    if (!livestat) {
      return res.status(404).json({ error: "Livestat not found" });
    }

    res.json(livestat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateLivestat = async (req, res) => {
  const data = req.body;
  try {
    const db = await connectToDatabase();
    const collection = db.collection('livestats2');

    const result = await collection.findOne({ IdCRM: data.IdCRM });
    // console.log(data);
    if (result) {

      await collection.updateOne(
        { _id: result._id },
        {
          $set: {
            TotalHT: data.Total_HT,
            TVA: data.TVA,
            TotalTTC: data.Total_TTC,
            Especes: data.Especes,
            CarteBancaire: data.Carte_Bancaire,
            Cheques: data.Cheques,
            TicketResto: data.TicketResto,
            SurPlace: data.SurPlace,
            A_Emporter: data.A_Emporter,
            Livraison: data.Livraison,
            devise: data.devise
          }
        }
      );

      console.log("Updated successfully");
    } else {
      console.log('No result found.');

      await collection.insertOne({
        TotalHT: data.Total_HT,
        TVA: data.TVA,
        TotalTTC: data.Total_TTC,
        Especes: data.Especes,
        CarteBancaire: data.Carte_Bancaire,
        Cheques: data.Cheques,
        TicketResto: data.TicketResto,
        SurPlace: data.SurPlace,
        A_Emporter: data.A_Emporter,
        Livraison: data.Livraison,
        IdCRM: data.IdCRM,
        devise: data.devise
      });

      console.log("1 record inserted");
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateLivestat2 = async (req, res) => {
  const data = req.body;
  console.log(data)

  try {
    const db = await connectToDatabase();
    const collection = db.collection('livestats2');
    console.log("livestats 2 : ", data);

    for (const livestat of data) {
      const result = await collection.findOne({ IdCRM: livestat.IdCRM, date: livestat.date });
      const updateFields = {};
      for (const key in livestat) {      
          updateFields[key] = livestat[key];
      }
      if (result) {
       
       
        await collection.updateOne(
          { _id: result._id },
          {
            $set: updateFields

          }
        );

        console.log("Updated successfully");
      } else {
        console.log('No result found.');

       

        await collection.insertOne(updateFields);

        console.log("1 record inserted");
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getLivestatByIdandDate = async (req, res) => {


  const idCRM = req.query.idCRM;
  const { date1, date2 } = req.query;
  try {
    const db = await connectToDatabase();
    const collection = db.collection('livestats2');

    const startDateString = date1.toString();
    const endDateString = date2.toString();

    const livestats = await collection.aggregate([
      {
        $match: {
          IdCRM: idCRM,
          date: { $gte: startDateString, $lte: endDateString }
        }
      },
      {
        $group: {
          _id: null,
          TotalHT: { $sum: { $toDouble: "$TotalHT" } },
          TVA: { $sum: { $toDouble: "$TVA" } },
          TotalTTC: { $sum: { $toDouble: "$TotalTTC" } },
          Especes: { $sum: { $toDouble: "$Especes" } },
          CarteBancaire: { $sum: { $toDouble: "$CarteBancaire" } },
          Cheques: { $sum: { $toDouble: "$Cheques" } },
          TicketResto: { $sum: { $toDouble: "$TicketResto" } },
          SurPlace: { $sum: { $toDouble: "$SurPlace" } },
          A_Emporter: { $sum: { $toDouble: "$A_Emporter" } },
          Livraison: { $sum: { $toDouble: "$Livraison" } },
          devise: { $first: "$devise" } 
        }
      },
      {
        $project: {
          _id: 0
        }
      }
    ]).toArray();

    if (livestats.length === 0) {
      return res.status(404).json({ error: "Livestats not found within the specified date range" });
    }

    res.json(livestats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

 const updateStatusStores = async (req, res) => {
  const data = req.body;
  console.log(data)
  try {
    const db = await connectToDatabase();
    const collection = db.collection('user');

    const response = await collection.findOne({ idCRM: data.IdCRM });
   console.log(response);
    if (response) {

      await collection.updateOne(
        { _id: response._id },
        {
          $set: {
            Status: data.statusStores,
           
          }
        }
      );

      console.log("Updated  status successfully");
    } 

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { getLivestat, getLivestatById, updateLivestat, updateLivestat2, getLivestatByIdandDate,updateStatusStores };
