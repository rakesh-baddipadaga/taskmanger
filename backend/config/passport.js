// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/user');

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: '/api/auth/google/callback',
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       // Check if the user already exists in the database
//       const existingUser = await User.findOne({ googleId: profile.id });
//       if (existingUser) {
//         return done(null, existingUser);
//       }

//       // If the user doesn't exist, create a new user
//       const newUser = new User({
//         googleId: profile.id,
//         email: profile.emails[0].value,
//       });
//       await newUser.save();
//       done(null, newUser);
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

// module.exports = passport;
