const jwt = require("jsonwebtoken");
const { connectToDatabase, client: dbConfig } = require("../config/dbConfig.js");
const dotenv = require("dotenv");
const { ObjectId } = require('mongodb');

const UsersModel = require('../models/UsersModel.js');

dotenv.config();

const signin = async (req, res) => {
  const secretKey = process.env.ACCESS_TOKEN2;

  try {
    const { Login, Password } = req.body;
    const db = await connectToDatabase();
    const collection = db.collection('user');
    const response = await collection.findOne({ Login, Password });

    if (!response) {
      console.log("User not found");
      return res.status(200).json({
        msg: "User does not exist.",
        success: false,
      });
    } else {
      const access_token = jwt.sign(
        { id: response._id, Role: response.Role },
        secretKey,
        {}
      );

      const decodedToken = jwt.decode(access_token);
      if (decodedToken) {
        const userRole = decodedToken.Role;
        // Use the userRole as needed in your front-end code
      }
      const user = response;
      const user2 = {access_token:access_token,idCRM: user.idCRM,userid:user._id}

      return res.status(200).json({
        msg: "User found.",
        success: true,
        data: user2,
      });
    }
  } catch (err) {
    console.error("Error during signin:", err);
    res.status(500).json({ msg: err?.message, success: false });
  }
};





 const getUserById = async (req, res) => {
  const userId = req.query.idUser;
  const _id = new ObjectId(userId); //
   const db = await connectToDatabase();
  const collection = db.collection('user');

  try {



    const response = await collection.findOne({ _id });
    
    if (!response) {
      console.log("User not found");
      return res.status(404).json({
        msg: "User not found.",
        success: false,
      });
    }

    const user = response;

    return res.status(200).json({
      msg: "User found.",
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ msg: err?.message, success: false });
  }
};




 const signup = async (req, res) => {
  try {
    const { Nom, Login, Password, Tel, idCRM ,Prenom,Email,Address } = req.body;
    const db = await connectToDatabase();
    const collection = db.collection('user');

    const existingUser = await collection.findOne({ Login, idCRM });

    if (existingUser) {
      console.log("User already exists");
      return res.status(200).json({
        msg: "User already exists.",
        success: false,
      });
    }
    const Role = "store";
    const newUser = { Nom, Login, Password, Tel, idCRM, Role,Prenom,Email,Address };
    const response = await collection.insertOne(newUser);

    return res.status(200).json({
      msg: "User created successfully.",
      success: true,
      data: response,
    });

  } catch (err) {
    res.status(500).json({ msg: err?.message, success: false });
  }
};


 const getUserByRole = async (req, res) => {
  const db = await connectToDatabase();
  const collection = db.collection('user');
  
  try {
    const user = await collection.find({ Role: "store" }).toArray();;

    if (!user) {
      console.log("they are no users with role store");
      return res.status(404).json({
        msg: "they are no users with role store.",
        success: false,
      });
    }


    return res.status(200).json({
      msg: "Users found.",
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Error fetching user by role:", err);
    res.status(500).json({ msg: err?.message, success: false });
  }
};

 const getAllUsers = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('user');

    const users = await collection.find().toArray();

    if (users.length === 0) {
      return res.status(404).json({
        msg: "Aucun utilisateur n'a été trouvé.",
        success: false,
      });
    }

    return res.status(200).json({
      msg: "Utilisateurs trouvés.",
      success: true,
      data: users,
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs :", err);
    res.status(500).json({ msg: err?.message, success: false });
  }
};


export const updateStatusStores = async (req, res) => {
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

module.exports = { signin, getUserById, signup, getUserByRole, getAllUsers };
