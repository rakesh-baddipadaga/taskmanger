const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
require('./config/passport');  // Import passport configuration
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');

const app = express();
// app.get('/', (req, res) => {
//   res.send('Welcome to the API');
// });
// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://taskmanger1.vercel.app'  
}));
app.use(passport.initialize());  // Initialize passport

// Routes
app.use('/api', userRoutes);
app.use('/api', taskRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

