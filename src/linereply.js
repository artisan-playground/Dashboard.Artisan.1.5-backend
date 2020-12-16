const Client = require('@line/bot-sdk').Client;

// ES6 modules or TypeScript
import { Client } from '@line/bot-sdk';

const client = new Client({
	channelAccessToken: 'GuB/WYYKYM3GNo6Ym44iKGGgikY215YSTcnRxaO2b0YChi8T4wk6bEI00nu0fq5oZALse0YAZP3+kLZMqOqCU5cjurs3QGHBVJkU6zo4t//dtu90DXNLP3G8osac5UKwXHbT8OaLhHNfaLpWYXd6KQdB04t89/1O/w1cDnyilFU=',
	channelSecret: '89f07b050db23826a1fcf5e151053de0'
  });

//   client.pushMessage(userId, { type: 'text', text: 'hello, world' });

// console.log(client);

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
