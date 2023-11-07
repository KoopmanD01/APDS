const jwt = require('jsonwebtoken');
//file that handles token date updates and removal
const { updateTokenActivity, checkInactiveTokens, tokens } = require('../utils/tokenManager');


function auth(req, res, next) {

  // Update token activity for all tokens
  for (const token in tokens) 
    {
        updateTokenActivity(token);
    }
        
    checkInactiveTokens();

    //header in https requests
    const token = req.header('Authenticator');
    let id;

  // Check if the token is inactive, after 15 minutes of no activity token expires
    if (!tokens[token]) 
    {
        return res.status(401).json({ error: 'Token is inactive or invalid' });
    }

    try 
    {
        //verifying token 
        const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        id = userId;
    } 
    catch (err) 
    {
        return res.status(401).json({ error: 'Token is inactive or invalid' });
    }

  if (id) {
    req.user = { id };
    updateTokenActivity(token);
    return next();
  }

  res.status(401).json({ error: 'Token is inactive or invalid' });
}

module.exports = auth;
