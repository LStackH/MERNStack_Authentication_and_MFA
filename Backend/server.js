require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const drawingRouter = require('./routes/drawingRoutes');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/cybersecurity_project', {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined!');
  process.exit(1);
}

// Initial routing
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/drawing', drawingRouter);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
