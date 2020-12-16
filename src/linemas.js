var express = require('express')
var bodyParser = require('body-parser')
// var request = require('request')
var app = express()

app.use(bodyParser.json())

app.set('port', (5000))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

import { Client } from '@line/bot-sdk'

const client = new Client({
	channelAccessToken: 'GuB/WYYKYM3GNo6Ym44iKGGgikY215YSTcnRxaO2b0YChi8T4wk6bEI00nu0fq5oZALse0YAZP3+kLZMqOqCU5cjurs3QGHBVJkU6zo4t//dtu90DXNLP3G8osac5UKwXHbT8OaLhHNfaLpWYXd6KQdB04t89/1O/w1cDnyilFU=',
	channelSecret: '89f07b050db23826a1fcf5e151053de0'
  });

app.post('/webhook', (req, res) => {

  const event = req.body.events[0];

if (event.type === 'message') {
  const message = event.message;

  if (message.type === 'text' && message.text === 'bye') {
    // if (event.source.type === 'room') {
    //   client.leaveRoom(event.source.roomId);
    // } else if (event.source.type === 'group') {
    //   client.leaveGroup(event.source.groupId);
    // } else {
      client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'I cannot leave a 1-on-1 chat!',
      });
    // }
  }
}
  // var text = req.body.events[0].message.text
  // var sender = req.body.events[0].source.userId
  // var replyToken = req.body.events[0].replyToken
  // console.log(text, sender, replyToken)
  // console.log(typeof sender, typeof text)
  // // console.log(req.body.events[0])
  // if (text === 'Hello') {
  //   sendText(sender, text)
  // }
  res.sendStatus(200)
})

function sendText (sender, text) {
  let data = {
    to: sender,
    messages: [
      {
        type: 'text',
        text: 'สวัสดีค่ะ '
      }
    ]
  }
  request({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer GuB/WYYKYM3GNo6Ym44iKGGgikY215YSTcnRxaO2b0YChi8T4wk6bEI00nu0fq5oZALse0YAZP3+kLZMqOqCU5cjurs3QGHBVJkU6zo4t//dtu90DXNLP3G8osac5UKwXHbT8OaLhHNfaLpWYXd6KQdB04t89/1O/w1cDnyilFU=',
    },
    url: 'https://api.line.me/v2/bot/message/push',
    method: 'POST',
    body: data,
    json: true
  }, function (err, res, body) {
    if (err) console.log('error')
    if (res) console.log('success')
    if (body) console.log(body)
  })
}

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})

// var http = require('http');
// http.createServer(function (req, res) {
//  res.writeHead(200, {'Content-Type': 'text/plain'});
//  res.end('Hello World 66666');
// }).listen(5000, '127.0.0.1');
// console.log('Server running at http://127.0.0.1:5000/');
