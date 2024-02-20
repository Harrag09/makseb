const { connectToDatabase, client } = require('../config/dbConfig.js');


const { ObjectId } = require('mongodb');

const getLivestat = async (req, res) => {
  const idCRM = req.body.idCRM;

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
  const idCRM = req.body.idCRM;

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
const updateLivestat3 = async (req, res) => {
  const data = req.body;
  console.log(data)

  try {
    const db = await connectToDatabase();
    const collection = db.collection('livestats');
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




const calculateSumsForEachLine = (objects, sumsForEachLine = {}) => {
  objects.forEach(obj => {
      for (const key in obj) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
              sumsForEachLine[key] = calculateSumsForEachLine([obj[key]], sumsForEachLine[key] || {});
          }  
         if (typeof obj[key] === 'number') 
          {
              // If the value is a number, add it to the sum
              const result = (sumsForEachLine[key] || 0) + obj[key];
              sumsForEachLine[key] = Math.round(result * 100) / 100;}
              if (typeof obj[key] === 'string') 
          {  if (key != 'date') { sumsForEachLine[key] =  obj[key];  }
                        }
      }
  });

  return sumsForEachLine;
};

const getLivestatByIdandDate = async (req, res) => {
  try {
      const idCRM = req.body.idCRM;
      const startDateString = req.body.date1;
      const endDateString = req.body.date2;

      // Connect to the database
      const db = await connectToDatabase();
      const collection = db.collection('livestats');

      // Aggregate query to calculate live stats
      const livestats = await collection.aggregate([
          {
              // Match documents based on IdCRM and date range
              $match: {
                  IdCRM: idCRM,
                  date: { $gte: startDateString, $lte: endDateString }
              }
          },
      ]).toArray();

      if (livestats.length === 0) {
          return res.status(404).json({ error: "Livestats not found within the specified date range" });
      } else {
          const sumsForEachLine = calculateSumsForEachLine(livestats);
      
      

          res.json(sumsForEachLine);
      }
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
module.exports = { getLivestat, getLivestatById, updateLivestat, updateLivestat2, updateLivestat3, getLivestatByIdandDate, updateStatusStores };
