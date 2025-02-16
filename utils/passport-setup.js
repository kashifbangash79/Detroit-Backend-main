// passport-setup.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/Users'); // Adjust path as necessary
require('dotenv').config();
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

// Google Strategy
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: 'https://detroitweb.netlify.app/user-profile',
// }, async (accessToken, refreshToken, profile, done) => {
//     try {
//         console.log('Google profile:', profile);
//         const existingUser = await User.findOne({ googleId: profile.id });
//         if (existingUser) {
//             return done(null, existingUser);
//         }

//         // Create a new user if not found
//         const newUser = await new User({
//             googleId: profile.id,
//             fullName: profile.displayName,
//             email: profile.emails[0].value,
//             dob: null, // You may want to handle this based on your app's requirements
//             profileImage: profile.photos[0].value || null,
//             // Add any additional fields as necessary
//         }).save();
//         console.log('New user created:', newUser);

//         done(null, newUser);
//     } catch (error) {
//         done(error, null);
//     }
// }));

// // Facebook Strategy
// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: '/auth/facebook/callback',
//     profileFields: ['id', 'displayName', 'emails', 'photos']
// }, async (accessToken, refreshToken, profile, done) => {
//     try {
//         const existingUser = await User.findOne({ facebookId: profile.id });
//         if (existingUser) {
//             return done(null, existingUser);
//         }

//         // Create a new user if not found
//         const newUser = await new User({
//             facebookId: profile.id,
//             fullName: profile.displayName,
//             email: profile.emails[0].value,
//             dob: null, // You may want to handle this based on your app's requirements
//             profileImage: profile.photos[0].value || null,
//             // Add any additional fields as necessary
//         }).save();

//         done(null, newUser);
//     } catch (error) {
//         done(error, null);
//     }
// }));