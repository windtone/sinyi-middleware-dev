//  Express
const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());

//  Fetch API
const fetch = require('node-fetch');

//  global config
const config = require('./config.js');

const PORT = config.PORT;
const URL_API = config.URL_API;

//  接收 AOG 傳來的訊息
app.post('/', async (req, res, next) => {
  let response = await systalk(req.body);
  res.send(response);

  return next();
});

app.listen(PORT, () => console.log(`webhook starting at port ${PORT}`));

// send to systalk AI
async function systalk(payload) {
  let res;
  console.log("=== payload ===");
  console.log(payload);
  await fetch(URL_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(json => res = json)
    .catch(error => console.log(error));
  return res;
}
