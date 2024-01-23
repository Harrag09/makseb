var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { connectToDatabase } = require('./config/dbConfig.js');
const livestatsRoutes = require('./routes/livestatsRoutes.js');
const authRoutes = require('./routes/auth.js');
const usersRoutes = require('./routes/users.js');
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectToDatabase();

// Routes
app.use('/', livestatsRoutes);
app.use('/', authRoutes);
app.use('/api',usersRoutes)

app.use(cors({
    origin: ['https://harrag09.github.io/maksebfrontend',"http://localhost:3000"],
    credentials: true,
}))


const PORT = 8002;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
