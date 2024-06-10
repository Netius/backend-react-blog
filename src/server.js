import express from "express";
import { MongoClient, ServerApiVersion } from 'mongodb';
import * as dotenv from 'dotenv'

dotenv.config(); // Uses MONGODB_URI from .env file from my database connection om MongoDB 

const app = express();
app.use(express.json()); // Middleware to get req body in json format


app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db('sample_mflix'); //Choose database to query
    const article = await db.collection('articles').findOne({ name: name });

    if (article) {
      res.json(article);
    } else {
      res.sendStatus(404);
    }

  } finally {
    await client.close();
  }

})


app.put('/api/articles/:name/upvote', async (req, res) => {
  const { name } = req.params;
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db('sample_mflix'); //Choose database to query
    await db.collection('articles').updateOne({ name: name }, {
      $inc:{upvote: 1}
    });

    const article = await db.collection('articles').findOne({ name: name });

    if (article) {
      res.send(`The article ${name} has now ${article.upvote} upvotes!`)
    } else {
      res.send('That article does not exist!');
    }
  } finally {
    await client.close();
  }
})

app.post('/api/articles/:name/comments', (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;
  const article = articlesInfo.find(article => article.name === name);
  if (article) {
    article.comments.push({ postedBy, text });
    res.send(article.comments);

  } else {
    res.send('That article does not exist!');
  }
})

app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});