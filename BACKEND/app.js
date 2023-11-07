require('dotenv').config();
const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const hsts = require('./middleware/hsts');
const mongoose = require('mongoose');
const { checkInactiveTokens } = require('./utils/tokenManager');

// DB connection
mongoose.connect(process.env.MONGODB).then(() => console.log('Connected :=)'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});

// Middleware
app.use(helmet());
app.use(cors({ origin: 'https://localhost:4200', optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(hsts);

// Periodically check inactive tokens every 2 minutes
setInterval(() => {
  checkInactiveTokens();
}, 2 * 60 * 1000);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts')); 

// Listen
https.createServer(
  {
    key: fs.readFileSync('./keys/privatekey.pem'),
    cert: fs.readFileSync('./keys/certificate.pem'),
    passphrase: 'apds',
  },
  app
)
  .listen(3000);


  
