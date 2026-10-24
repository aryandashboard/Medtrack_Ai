require('dotenv').config();
const { MongoClient } = require('mongodb');

async function runExact() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.log("URI configured: NO");
    process.exit(1);
  }

  const client = new MongoClient(uri, {
    family: 4
  });

  try {
    await client.connect();
    const result = await client.db('admin').command({ ping: 1 });
    console.log("SUCCESS");
  } catch (err) {
    console.log("FAILED");
    console.log(err.name, err.message);
  } finally {
    await client.close();
  }
}

runExact();
