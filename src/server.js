import express from "express";

const app = express();
app.use(express.json()); // Middleware to get req body in json format


let articlesInfo = [
  {
    name: "learn-react",
    upvote: 0,
    comments: [],
  },
  {
    name: "learn-node",
    upvote: 0,
    comments: [],
  },
  {
    name: "mongodb",
    upvote: 0,
    comments: [],
  },
]

app.put('/api/articles/:name/upvote', (req, res) => {
  const { name } = req.params;
  const article = articlesInfo.find(article => article.name === name);
  if (article) {
    article.upvote += 1;
    res.send(`The article ${name} has now ${article.upvote} upvotes!`)
  } else {
    res.send('That article does not exist!');
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