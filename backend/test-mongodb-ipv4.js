require('dotenv').config();
const mongoose = require('mongoose');

console.log("Attempting connection with mongoose using { family: 4 } (IPv4 force)...");

mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => {
    console.log('MongoDB connected successfully with IPv4!');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error with IPv4:');
    console.error(err.name + ': ' + err.message);
    process.exit(1);
  });
