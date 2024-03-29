const express = require('express');
const cookieParser = require('cookie-parser');
const { connectToDatabase } = require('./config/dbConfig.js');
const cors = require('cors');
const livestatsRoutes = require('./routes/livestatsRoutes.js');
const authRoutes = require('./routes/auth.js');
const usersRoutes = require('./routes/users.js');
const multer = require('multer');
const path = require('path');
const app = express();
const fs = require('fs');

// Enable CORS for the specific origin
app.use(cors({
  origin: ['https://harrag09.github.io','http://localhost:3002','http://localhost:3001','http://statistics.sc3makseb.universe.wf','http://localhost:3000'],
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


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


app.post('/upload', upload.single('image'), (req, res) => {

  
  res.send('File uploaded successfully !');
});





app.get('/images', (req, res) => {
  const uploadDirectory = 'uploads/';

  // Read the contents of the upload directory
  fs.readdir(uploadDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read directory' });
    }

    // Filter out only the image files
    const imageFiles = files.filter(file => {
      const extname = path.extname(file).toLowerCase();
      return extname === '.png' || extname === '.jpg' || extname === '.jpeg' || extname === '.gif';
    });

    // Send the array of image file names in the response
    res.json({ images: imageFiles });
  });
});







const PORT = 8002;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
