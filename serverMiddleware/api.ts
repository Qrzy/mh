const bodyParser = require('body-parser');
const express = require('express');
const getMhGithubRepo = require('./getMhGithubRepo');

const app = express();
app.use(bodyParser.json());

app.get('/mhGithubRepo', async (req, res) => {
  const mhNumber = req.query.mhNo;
  const repo = await getMhGithubRepo(mhNumber);
  res.json(repo);
  res.end();
});

module.exports = app;
