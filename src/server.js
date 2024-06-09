import express from "express";

const app = express();
app.use(express.json());

app.post("/hello", (req, res) => {
  console.log(req);
  res.send(`Hello ${req.body.name} ${req.body.age} !`);
});

app.get("/hello/:name", (req, res) => {
  const { name } = req.params;
  res.send(`Hello ${name}!!`);
})

let articlesInfo = [
  {
    name: "learn-react",
    upvote: 0,
  },
  {
    name: "learn-node",
    upvote: 0,
  },
  {
    name: "mongodb",
    upvote: 0,
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

app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});