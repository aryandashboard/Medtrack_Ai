require('dotenv').config();
const mongoose = require('mongoose');

async function testMongoose() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is missing from environment");

    console.log("Attempting Mongoose connection...");
    await mongoose.connect(uri, {
      family: 4,
      serverSelectionTimeoutMS: 15000
    });
    
    console.log("Mongoose connection SUCCESS");

    const pingResult = await mongoose.connection.db.admin().command({ ping: 1 });
    if (pingResult && pingResult.ok === 1) {
      console.log("MongoDB ping SUCCESS");
    } else {
      console.log("MongoDB ping failed: ", pingResult);
    }
  } catch (err) {
    console.log("--- ERROR DETAILS ---");
    console.log("Name:", err.name);
    console.log("Message:", err.message);
    if (err.reason) {
      console.log("Reason Type:", err.reason.type);
      
      if (err.reason.servers) {
        console.log("Servers Map:");
        for (const [address, desc] of err.reason.servers.entries()) {
          console.log(`  [${address}]:`);
          console.log(`    type: ${desc.type}`);
          console.log(`    error: ${desc.error ? desc.error.message || desc.error : 'None'}`);
        }
      } else {
        console.log("Reason:", err.reason);
      }
    }
    if (err.cause) {
      console.log("Cause:", err.cause);
    }
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("Disconnected cleanly.");
    }
  }
}

testMongoose();
