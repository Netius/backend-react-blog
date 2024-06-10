import express from "express";
import { db, connectToMongodb } from './mongodbConn.js';

const app = express();
app.use(express.json()); // Middleware to get req body in json format

// Connects to database MongoDB
connectToMongodb(() => {
  app.listen(8000, () => {
    console.log("Server is listening on port 8000");
  });
})

// Gets just one article
app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;
  const article = await db.collection('articles').findOne({ name: name });

  if (article) {
    res.json(article);
  } else {
    res.sendStatus(404);
  }
})

// Updates upvote by 1 
app.put('/api/articles/:name/upvote', async (req, res) => {
  const { name } = req.params;

  await db.collection('articles').updateOne({ name: name }, {
    $inc: { upvote: 1 }
  });

  const article = await db.collection('articles').findOne({ name: name });

  if (article) {
    res.send(`The article ${name} has now ${article.upvote} upvotes!`)
  } else {
    res.send('That article does not exist!');
  }
})

// Add comments with postedBy and text
app.post('/api/articles/:name/comments', async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;

  await db.collection('articles').updateOne({ name: name }, {
    $push: { comments: { postedBy, text } }
  });

  const article = await db.collection('articles').findOne({ name: name });

  if (article) {
    res.send(article.comments);
  } else {
    res.send('That article does not exist!');
  }

})