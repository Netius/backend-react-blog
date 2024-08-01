import express, { json } from "express";
import { db, connectToMongodb } from './mongodbConn.js';
import fs from 'fs';
import admin from 'firebase-admin';
import "dotenv/config";

import { fileURLToPath } from "url"; // Recreating __ name available when type is not equal to module - JS
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const credentials = JSON.parse(
  fs.readFileSync("./credentials.json")
)

admin.initializeApp({
  credential: admin.credential.cert(credentials)
})

const app = express();
app.use(express.json()); // Middleware to get req body in json format
app.use(express.static(path.join(__dirname, '../build')));

app.get(/^(?!\/api).+/,(req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'))
});

app.use(async (req, res, next) => {
  const { authtoken } = req.headers;

  if (authtoken) {
    try {
      req.user = await admin.auth().verifyIdToken(authtoken);
    } catch (error) {
      return res.sendStatus(400);
    }
  }
  req.user= req.user || {};
  next();
});


// Gets just one article
app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db.collection('articles').findOne({ name: name });

  if (article) {
    const upvoteIds = article.upvoteIds || [];
    article.canUpvote = uid && !upvoteIds.includes(uid);
    res.json(article);
  } else {
    res.sendStatus(404);
  }
})

// Checking if user are logged in and allows to upvote and comments with next()
app.use(async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401)
  }
})

// Updates upvote by 1 
app.put('/api/articles/:name/upvote', async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db.collection('articles').findOne({ name: name });

  if (article) {
    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);
    if (canUpvote) {
      await db.collection('articles').updateOne({ name: name }, {
        $inc: { upvote: 1 },
        $push: { upvoteIds: uid }
      });
    }

    const updatedArticle = await db.collection('articles').findOne({ name: name });
    res.json(updatedArticle);
  } else {
    res.send('That article does not exist!');
  }
})

// Add comments with postedBy and text
app.post('/api/articles/:name/comments', async (req, res) => {
  const { name } = req.params;
  const { text } = req.body;
  const { email } = req.user

  await db.collection('articles').updateOne({ name: name }, {
    $push: { comments: { postedBy: email, text } }
  });

  const article = await db.collection('articles').findOne({ name: name });

  if (article) {
    res.json(article);
  } else {
    res.send('That article does not exist!');
  }

})

const PORT = process.env.PORT || 8000;

// Connects to database MongoDB
connectToMongodb(() => {
  app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
  });
})