const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { connectToDatabase } = require('./config/dbConfig.js');
const livestatsRoutes = require('./routes/livestatsRoutes.js');
const authRoutes = require('./routes/auth.js');
const usersRoutes = require('./routes/users.js');
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Enable CORS
app.use(cors({
    origin: ['https://harrag09.github.io', 'http://localhost:3000'],
    credentials: true,
}));

// Handle preflight requests
app.options('*', cors());

// Connect to MongoDB
connectToDatabase();

// Routes
app.use('/', livestatsRoutes);
app.use('/', authRoutes);
app.use('/api', usersRoutes);

const PORT = 8002;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
