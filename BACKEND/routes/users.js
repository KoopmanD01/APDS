const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { User, validateUser } = require('../models/user');
const { hashPassword } = require('../utils/hash');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
  // validate user input according to user schema
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // check if the username is unique
  const isUnique = (await User.count({ username: req.body.username })) === 0;

  if (!isUnique)
    return res.status(400).json({ error: 'The username or password is not valid' });

  try {
    const user = new User(req.body);
    user.password = await hashPassword(user.password);
    await user.save();

    // Return a 201 status with a JSON response
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


//get current user details
router.get('/', auth, (req, res) => {
  
});

module.exports = router;