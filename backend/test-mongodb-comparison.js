require('dotenv').config();
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

async function runComparison() {
  console.log("Node version:", process.version);
  console.log("OpenSSL version:", process.versions.openssl);
  try {
    console.log("MongoDB driver version:", require('mongodb/package.json').version);
  } catch (e) {
    console.log("MongoDB driver version: Unknown");
  }
  console.log("Mongoose version:", mongoose.version);
  console.log("-------------------------------------------------");

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.log("MONGO_URI not found");
    return;
  }

  console.log("TEST 1 - Native MongoClient");
  let nativeClient;
  try {
    nativeClient = new MongoClient(uri, {
      family: 4,
      serverSelectionTimeoutMS: 15000
    });
    await nativeClient.connect();
    await nativeClient.db().admin().command({ ping: 1 });
    console.log("NATIVE: SUCCESS");
  } catch (err) {
    console.log("NATIVE: FAILED");
    console.log(err.name, err.message);
  } finally {
    if (nativeClient) await nativeClient.close();
  }

  console.log("-------------------------------------------------");
  
  console.log("TEST 2 - Mongoose");
  try {
    await mongoose.connect(uri, {
      family: 4,
      serverSelectionTimeoutMS: 15000
    });
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("MONGOOSE: SUCCESS");
  } catch (err) {
    console.log("MONGOOSE: FAILED");
    console.log(err.name, err.message);
    if (err.reason) console.log("Reason:", err.reason);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

runComparison();
