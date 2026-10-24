require('dotenv').config();
const mongoose = require('mongoose');
const { URL } = require('url');

const uri = process.env.MONGO_URI;

console.log("MongoDB Diagnostic");
if (!uri) {
  console.log("URI configured: NO");
  process.exit(1);
}
console.log("URI configured: YES");

let parsedUri;
try {
  parsedUri = new URL(uri);
  // We don't print the scheme directly because we want the output format, but we'll extract hostname
  console.log(`Host: ${parsedUri.hostname}`);
} catch (e) {
  console.log("Host: [Failed to parse URI]");
  process.exit(1);
}

console.log("Connecting...");

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESS: MongoDB connection established");
    process.exit(0);
  })
  .catch(err => {
    console.log("FAILED");
    console.log(`Error name: ${err.name}`);
    console.log(`Error code: ${err.code || 'N/A'}`);
    console.log(`Error message: ${err.message}`);
    process.exit(1);
  });
