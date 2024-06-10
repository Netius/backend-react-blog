import { MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config(); // Uses MONGODB_URI from .env file from my database connection om MongoDB 

let db;
const connectToMongodb = async (callback) => {
  const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");

  db = client.db('sample_mflix'); //Choose database to query
  callback();

  // await client.close(); TODO need to close connection when done

}

export {
  db,
  connectToMongodb
}