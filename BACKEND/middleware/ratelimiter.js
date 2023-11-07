const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes waiting time
  max: 3, // Limit each user to 3 requests
  keyGenerator: function(req) {
    return req.body.username; // Using the username as the key for rate limiting
  },
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many login attempts, please try again later.' });
  }
});

module.exports = loginLimiter;