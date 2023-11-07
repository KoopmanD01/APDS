const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { isValidPassword } = require('../utils/hash');
const loginLimiter = require('../middleware/ratelimiter');
const { generateToken } = require('../utils/tokenManager');

router.post('/', loginLimiter, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(401).json({ error: 'Incorrect username or password' });

    const valid = await isValidPassword(req.body.password, user.password);
    if (!valid) return res.status(401).json({ error: 'Incorrect username or password' });

    const token = generateToken(user._id); // Generate the token when user successfuly logs in

    res.status(200).json({
        //display user name
      message: `${user.firstName} Successfully Logged In`,
      token: token
    });
  } catch (error) {
    res.status(500).json({ error: 'Error Occurred while signing in' });
  }
});

module.exports = router;