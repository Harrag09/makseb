const express = require('express');
const cookieParser = require('cookie-parser');
const { connectToDatabase } = require('./config/dbConfig.js');
const cors = require('cors');
const livestatsRoutes = require('./routes/livestatsRoutes.js');
const authRoutes = require('./routes/auth.js');
const usersRoutes = require('./routes/users.js');

const app = express();

// Enable CORS for the specific origin
app.use(cors({
  origin: ['https://harrag09.github.io','http://localhost:3001','http://statistics.sc3makseb.universe.wf','http://localhost:3000'],
  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  credentials: true,
}));



app.options('*', cors());


app.use(express.json());
app.use(cookieParser());

// Connect to the database
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
