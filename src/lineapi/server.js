'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: 'GuB/WYYKYM3GNo6Ym44iKGGgikY215YSTcnRxaO2b0YChi8T4wk6bEI00nu0fq5oZALse0YAZP3+kLZMqOqCU5cjurs3QGHBVJkU6zo4t//dtu90DXNLP3G8osac5UKwXHbT8OaLhHNfaLpWYXd6KQdB04t89/1O/w1cDnyilFU=',
  channelSecret: '89f07b050db23826a1fcf5e151053de0',
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) =>res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
 
  
  // client.getProfile('user_id').then((profile) => {
  //   console.log(profile);
  // });

  const echo = { type: 'text', text: event.message.text };
  // use reply API
  return client.replyMessage(event.replyToken, echo);


 
}

// listen on port
const port = process.env.PORT || 8020;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
app.listen(3000)