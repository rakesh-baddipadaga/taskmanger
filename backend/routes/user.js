const express = require('express');
const passport = require('passport');
const { registerUser, loginUser } = require('../controllers/usercontroller');
const router = express.Router();
const jwt = require('jsonwebtoken');


// Local authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Google authentication routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`/auth/success?token=${token}`);
  }
);

module.exports = router;
