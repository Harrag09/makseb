const { connectToDatabase} = require('../config/dbConfig.js');

const fs = require('fs');
const path = require('path');



const updateLivestat4 = async (req, res) => {
  const data = req.body;
  console.log(data)

  try {
    const db = await connectToDatabase();
    const collection = db.collection('livestats');
    console.log("livestats 2 : ", data);

    
      const result = await collection.findOne({ IdCRM: data.IdCRM, date: data.date });
      const updateFields = {};
      for (const key in data) {

        updateFields[key] = data[key];
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
    

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateLivestat3 = async (req, res) => {
  const data = req.body;
  console.log(data);

  try {
    // Connect to the database
    const db = await connectToDatabase();
    const collection = db.collection('TempsReels');
    
    // Delete existing data with the specified IdCRM
    for (const livestat of data) {
      await collection.deleteMany({ IdCRM: livestat.IdCRM });
    }

    // Insert new live state data into the collection
    for (const livestat of data) {
      const updateFields = {};
      for (const key in livestat) {
        updateFields[key] = livestat[key];
      }
      await collection.insertOne(updateFields);
    }

    console.log("Data updated successfully");
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const UpdateTiquer = async (req, res) => {
  const data = req.body;
  

  try {
    const db = await connectToDatabase();
    const collection = db.collection('Tiquer');
         console.log(data.IdCRM,data.date,data.idTiquer);
      const result = await collection.findOne({ IdCRM: data.IdCRM, date: data.date ,idTiquer :data.idTiquer });
          console.log(result);
      const updateFields = {};
      for (const key in data) {

        updateFields[key] = data[key];
      }
      
      if (result) {

        console.log("aready Exist");
      } else {
        console.log('No result found.');



        await collection.insertOne(updateFields);

        console.log("1 Tiquer  inserted");
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
      if (typeof obj[key] === 'number') {
        // If the value is a number, add it to the sum
        const result = (sumsForEachLine[key] || 0) + obj[key];
        sumsForEachLine[key] = Math.round(result * 100) / 100;
      }
      if (typeof obj[key] === 'string') {
        if (key != 'date') { sumsForEachLine[key] = obj[key]; }
      }
    }
  });

  return sumsForEachLine;
};

const getLivestatByIdandDate = async (req, res) => {
  try {
    const idCRM = req.query.idCRM; 
    const startDateString = req.query.date1;
    const endDateString = req.query.date2;

    const db = await connectToDatabase();
    const collection = db.collection('livestats');

    const livestats = await collection.aggregate([
      {
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

const getLivestatByIdandDate2 = async (req, res) => {
  try {
    const idCRM = req.query.idCRM; 
    const startDateString = req.query.date1;
    const endDateString = req.query.date2;

    const db = await connectToDatabase();
    const collection = db.collection('TempsReels');

    const livestats = await collection.aggregate([
      {
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
      if (data.LastCommand != null) {
        await collection.updateOne(
          { _id: response._id },
          {
            $set: {
              Status: data.statusStores,
              LastCommand: data.LastCommand

            }
          }
        );

        console.log("Updated  status  et LastCommand successfully");
      }
      else {
        await collection.updateOne(
          { _id: response._id },
          {
            $set: {
              Status: data.statusStores
            

            }
          }
        );

        console.log("Updated  status successfully");
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const GetLicence = async (req, res) => {

  try {
    const db = await connectToDatabase();
    const collection = db.collection('user');
    const idCRM = req.params.idCRM;
    const user = await collection.findOne({ idCRM: idCRM });

    let hasLicense = false;
  
    if (user) {
      if(user.Licence==="Enable"){   hasLicense = "EMakseb";}
      else{hasLicense = "MaksebD";} 
   
    }
console.log(hasLicense);
    res.json({ hasLicense });


  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Internal Server Error" });
  }
};

const UpdateLicence = async (req, res) => {

  try {
    const db = await connectToDatabase();
    const collection = db.collection('user');
    const idCRM = req.params.idCRM;
    const action = req.params.action;
    console.log(idCRM, action);

    if (action === '') {
      return res.status(400).json({ error: 'Invalid action' });
    }
    const response = await collection.findOne({ idCRM: idCRM });
    await collection.updateOne(
      { _id: response._id },
      {
        $set: {
          Licence: action

        }
      }
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Internal Server Error" });
  }
};






const updateAllCatInUploid = async (req, res) => {
  try {
    const data = req.body;

    const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '');
    const decodedImage = Buffer.from(base64Data, 'base64');

    const parentFolderPath = path.join(__dirname, '..'); // Go up one directory level
    const folderPath = path.join(parentFolderPath, 'uploads', data.IdCRM);
   

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true }); 
    }

    const filename = `${data.Categories}.png`;

    fs.writeFileSync(path.join(folderPath, filename), decodedImage);

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const updateAllCatCripteInMongo = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const db = await connectToDatabase();
    const collection = db.collection('Images');
    console.log("Catégories", data);

    const result = await collection.findOne({ IdCRM: data.IdCRM, Categories: data.Categories });



    if (result) {
      await collection.updateOne(
        { _id: result._id },
        { $set: data }
      );
      console.log("Updated Catégories");
    } else {
      console.log('No result found.');
      await collection.insertOne(data);
      console.log("1 Catégories inserted");
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getAllCatInUploid = async (req, res) => {
  try {
    const { IdCRM } = req.query; // Assuming IdCRM is sent as a query parameter

    const parentFolderPath = path.join(__dirname, '..'); // Go up one directory level
    const folderPath = path.join(parentFolderPath, 'uploads', IdCRM);

    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const files = fs.readdirSync(folderPath);

    // Filter out only the image files

    const imageNames = files.filter(file => fs.statSync(path.join(folderPath, file)).isFile())
                             .map(file => file.split('.')[0]);
    
    res.status(200).json({ imageNames  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTiquerId = async (req, res) => {
  try {
      const idCRM = req.query.idCRM; 
    const startDateString = req.query.date1;
    const endDateString = req.query.date2;


    const db = await connectToDatabase();
    const collection = db.collection('Tiquer');

    const livestats = await collection.aggregate([
      {
        $match: {
          IdCRM: idCRM,
          Date: { $gte:  startDateString, $lte: endDateString }
        }
      },
    ]).toArray();
   console.log(livestats);
    if (livestats.length === 0) {
      return res.status(404).json({ error: "Livestats not found within the specified date range" });
    } else {
    
      res.json(livestats);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const generateTicketsHTML = async (req, res) => {
 const data = req.query.data; 

  tickets = data;
  let htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tickets</title>
      <style>
          /* Define your CSS styles here */
          body {
              font-family: Arial, sans-serif;
          }
          .ticket {
              margin: 20px;
              padding: 10px;
              border: 1px solid #ccc;
          }
          .ticket-details {
              margin-bottom: 10px;
          }
          .items-list {
              margin-top: 10px;
          }
          .item {
              margin-bottom: 5px;
          }
          .payment-details {
              margin-top: 10px;
          }
          /* Add more styles as needed */
      </style>
  </head>
  <body>
  `;

  if (tickets) {
    tickets.forEach(ticket => {
      const ticketDate = new Date(ticket.Date.substring(0, 4), parseInt(ticket.Date.substring(4, 6)) - 1, ticket.Date.substring(6, 8));
      const formattedDate = ticketDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      htmlContent += `
      <div class="ticket">
          <div class="ticket-details">
              // <p>${ticket.name}</p>
              <p>ALIZETH DIGITAL EL MAY DJERBA 4175 DJERBA</p>
              <p>${formattedDate} ${ticket.HeureTicket}</p>
              <p>Servi par: ADMIN</p>
              <p>TICKET: ${ticket.idTiquer}</p>
          </div>
          <div class="items-list">
              <ul>
      `;

      ticket.Menu.forEach(item => {
        htmlContent += `
        <li class="item">${item.QtyProduct}. ${item.NameProduct}: ${item.TTC} ${item.QtyProduct * item.TTC} ${ticket.devise}</li>
        `;

        if (item.Gredient && item.Gredient.length > 0) {
          item.Gredient.forEach(option => {
            htmlContent += `
            <li class="item">${option.NameProduct}: ${option.TTC} ${option.TTC * option.QtyProduct} ${ticket.devise}</li>
            `;
          });
        }

        if (item.Sup && item.Sup.length > 0) {
          item.Sup.forEach(option => {
            htmlContent += `
            <li class="item">${option.QtyProduct}. ${option.NameProduct}: ${option.TTC} ${option.TTC * option.QtyProduct} ${ticket.devise}</li>
            `;
          });
        }
      });

      htmlContent += `
              </ul>
          </div>
          <div class="payment-details">
      `;

      ticket.ModePaiement.forEach(payment => {
        htmlContent += `
        <p>${payment.ModePaimeent}: ${payment.totalwithMode} ${ticket.devise}</p>
        `;
      });

      htmlContent += `
          </div>
          <div class="closing-note">
              <p>${ticket.ModeConsomation.toUpperCase()}</p>
              <p>MERCI DE VOTRE VISITE A TRES BIENTOT</p>
          </div>
      </div>
      `;
    });
  }

  htmlContent += `
  </body>
  </html>
  `;

  res.send(htmlContent);
};  



module.exports = { generateTicketsHTML,  getTiquerId,UpdateTiquer, getLivestatByIdandDate2,getAllCatInUploid,updateAllCatCripteInMongo, updateAllCatInUploid, UpdateLicence,updateLivestat3,updateLivestat4, getLivestatByIdandDate, updateStatusStores, GetLicence };
