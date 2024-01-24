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
    }

    else {

      const access_token = jwt.sign(
        { id: response._id, Role: response.Role },
        secretKey,

        {}

      );

      const decodedToken = jwt.decode(access_token);

      if (decodedToken) {
        const userRole = decodedToken.Role;
        console.log(userRole);
      }
const user = response;


res.cookie("access_token", access_token, {
  httpOnly: true,
  secure: true,
  domain: ".makseb.onrender.com",
  path: "/",
  sameSite: "Lax"
}, (err) => {
  if (err) {
    console.error("Error setting access_token cookie:", err);
  }
});

// Repeat similar error handling for other cookies


res.cookie("loggedIn", "loggedIn", {
  httpOnly: true,
  secure: true,
  domain: ".makseb.onrender.com",
  path: "/",
  sameSite: "Lax"
}, (err) => {
  if (err) {
    console.error("Error setting loggedIn cookie:", err);
  }
});

     
res.cookie("idCRM", user.idCRM,  {
  httpOnly: true,
  secure: true,
  domain: ".makseb.onrender.com",
  path: "/",
  sameSite: "Lax"
}, (err) => {
  if (err) {
    console.error("Error setting idCRM cookie:", err);
  }
});
     
res.cookie("idUser", user._id.toString(), {
  httpOnly: true,
  secure: true,
  domain: ".makseb.onrender.com",
  path: "/",
  sameSite: "Lax"
}, (err) => {
  if (err) {
    console.error("Error setting idUser cookie:", err);
  }
});






      return res.status(200).json({
        msg: "User found.",
        success: true,
        data: response[0],
      });
    }
  } catch (err) {
    res.status(500).json({ msg: err?.message, success: false });
  }
};




 const getUserById = async (req, res) => {
  const userId = req.cookies.idUser;

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

    console.log(user);

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
module.exports = { signin, getUserById, signup, getUserByRole, getAllUsers };
