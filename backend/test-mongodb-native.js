require('dotenv').config();
const { MongoClient } = require('mongodb');

async function runNativeTest() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.log("URI configured: NO");
    process.exit(1);
  }

  console.log("Native MongoDB Driver Diagnostic");
  console.log("URI configured: YES");

  const client = new MongoClient(uri, {
    family: 4
  });

  try {
    console.log("Connecting...");
    await client.connect();
    
    console.log("Pinging admin database...");
    const adminDb = client.db('admin');
    const result = await adminDb.command({ ping: 1 });
    
    if (result.ok === 1) {
      console.log("SUCCESS: MongoDB connection and ping established");
      process.exit(0);
    } else {
      console.log("FAILED: Ping returned unexpected result");
      console.log(result);
      process.exit(1);
    }
  } catch (err) {
    console.log("FAILED");
    console.log(`Error name: ${err.name}`);
    console.log(`Error code: ${err.code || 'N/A'}`);
    console.log(`Error message: ${err.message}`);
    process.exit(1);
  } finally {
    await client.close();
  }
}

runNativeTest();
