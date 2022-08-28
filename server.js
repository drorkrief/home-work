const { json } = require("express");
const express = require("express");
const fetch = require("node-fetch");
const Redis = require("redis");
require("dotenv").config();
const fs = require('fs');
const port = process.env.PORT || 5000;
const redis_port = process.env.redis_port || 6379;
const expireTime = process.env.EXPIRE_TIME;
const client = Redis.createClient(redis_port);
const app = express();
client.connect();
app.use(express.json());

// post a comment
app.post("/postcomment/:id", (req, res) => {
  console.log("/postcomment", req.params.id);
  console.log(req.body);
  fs.writeFile(`./comments/${req.body.name}.txt`, JSON.stringify( req.body.text), err => {
    if (err) {
      console.error(err);
    }})
  res.status(202).send({ id: req.params.id, text: req.body });
});

// delete a person
app.delete("/removeactor/:id", async (req, res) => {
  let cacheData = await client.get("data");
  if (cacheData) {
    cacheData = JSON.parse(cacheData);
    let filteredList = cacheData.filter((x) => x.person.id != req.params.id);
    // console.log(filteredList);
    client.setEx("data", expireTime, JSON.stringify(filteredList));
    res.status(200).send({});
  }else {
    res.status(400).send("Please specify a portfolioId");
  }

  // res.status(200);
});

// Cache middleware
async function cache(req, res, next) {
  let cacheData = await client.get("data");
  if (cacheData) {
    return res.status(200).send(cacheData);
  }
  next();
}
async function setCache() {
  const response = await fetch("https://api.tvmaze.com/shows/1/cast");
  let data = await response.json();
  // store the list in redis
  client.setEx("data", expireTime, JSON.stringify(data));
  return JSON.stringify(data);
}
setCache()
// get the actors list
app.get("/actors", cache, async (req, res) => {
  let test = await setCache();
  res.send(test);
});

// listen to port
app.listen(port, () => {
  console.log(`server starting on port ${port}`);
});
