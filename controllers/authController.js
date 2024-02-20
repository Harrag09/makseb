const jwt = require("jsonwebtoken");
const { connectToDatabase, client: dbConfig } = require("../config/dbConfig.js");
const dotenv = require("dotenv");
const { ObjectId } = require('mongodb');
const mongoose = require("mongoose");

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



const deleteIdUser = async (req, res) => {
  const userId = req.params.id; 
  const id =new mongoose.Types.ObjectId(userId)
  console.log(userId);
  try {
    const db = await connectToDatabase();
    const collection = db.collection('user');
    const response = await collection.findOne({ _id:id });

    if (!response) {
      console.log("User not found");
      return res.status(200).json({
        msg: "User does not exist.",
        success: false,
      });
    }

    await collection.deleteOne({  _id:id });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the user' });
  }
};

const modifyUser = async (req, res) => {
  try {
    const userId = req.params.id; 
    const id =new mongoose.Types.ObjectId(userId)
    console.log(userId);

    

    const db = await connectToDatabase();
    const collection = db.collection('user');
    const existingUser = await collection.findOne({ _id: id });
    if (!existingUser) {
      console.log("User does not exist");
      return res.status(404).json({
        msg: "User does not exist.",
        success: false,
      });
    }
    const { Nom, Login, Password, idCRM } = req.body;
    await collection.updateOne({ _id: id }, { $set: { Login, Password, idCRM } });

    return res.status(200).json({
      msg: "User modified successfully.",
      success: true,
    });
  } catch (err) {
    console.error("An error occurred while modifying the user:", err);
    res.status(500).json({ msg: "An error occurred while modifying the user", success: false });
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
        const Licence = "Enable";

    const Role = "store";
    const newUser = { Nom, Login, Password, Tel, idCRM, Role,Prenom,Email,Address , Licence };
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


 

module.exports = { signin, getUserById, signup, getUserByRole, getAllUsers,deleteIdUser,modifyUser };
