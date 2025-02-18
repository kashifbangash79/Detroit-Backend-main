const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const authRoutes = require('./routes/authRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const profileRoutes = require('./routes/profileRoutes');
const blogRoutes = require('./routes/blogRoutes');
const referralRoutes = require('./routes/referralRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const session = require('express-session');
const passport = require('passport');
const eventsRoutes = require('./routes/eventsRoutes');
require('./utils/passport-setup');
require('dotenv').config(); // Load environment variables

console.log(process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const app = express();
// Allow requests from your frontend
app.use(
  cors({
    origin: "*", // Allow requests from any origin
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, // Allow cookies if needed
  })
);

app.use(bodyParser.json());
console.log(process.env.SESSION_SECRET);
// Session setup (required for Passport)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// Define your routes
app.use('/auth', authRoutes); // Authentication routes (signup, login, OAuth)
app.use('/experiences', experienceRoutes);
app.use('/reviews', reviewRoutes);
app.use('/itineraries', itineraryRoutes);
app.use('/profiles', profileRoutes);
app.use('/blogs', blogRoutes);
app.use('/referrals', referralRoutes);
app.use('/stripe', stripeRoutes);
app.use('/viewEvents',eventsRoutes)
// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
