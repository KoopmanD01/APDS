const jwt = require('jsonwebtoken');

const tokens = {}; // Token storage with last activity timestamp

function generateToken(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY);
  tokens[token] = { userId, lastActivity: Date.now() };
  return token;
}
//updates activity every 2 minutes
function updateTokenActivity(token) {
  if (tokens[token]) {
    tokens[token].lastActivity = Date.now();
  }
}

//verifies time from updatetoken function date
function checkInactiveTokens() {
  const inactivityPeriod = 15 * 60 * 1000; // 15 minutes 

  for (const token in tokens) {
    const currentTime = Date.now();
    if (currentTime - tokens[token].lastActivity > inactivityPeriod) {
      // Deactivate the token if inactive in 15 minutes
      delete tokens[token];
    }
  }
}


module.exports = { generateToken, updateTokenActivity, checkInactiveTokens, tokens };