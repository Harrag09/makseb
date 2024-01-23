const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const mongoUri = process.env.MONGODB_URI;

const client = new MongoClient(mongoUri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db(); // return the MongoDB database object
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw error;
  }
}

module.exports = { connectToDatabase, client };
