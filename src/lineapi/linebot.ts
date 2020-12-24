import { UserRepository } from '../repository/UserRepository'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const axios = require('axios')

// const send = User

app.use(bodyParser.json())

app.set('port', 8020)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/webhook', (req: any, res: any) => {
	res.sendStatus(200)

	const sender = req.body.events[0].source.userId

	const followid = req.body.events[0]

	if (followid.type === 'follow') {
		const member = new UserRepository()
		member.create()

		axios.post('http://172.16.3.33:8100/api/clockin', {
			lineId: sender,
		})
		// .then(function (response) {
		//   if (response.data.responseCode === 200) {
		//     console.log('record success');

		//   } else if (response.data.responseCode === 401) {
		//     console.log('record fail');
		//   } else {
		//     console.log('nooooo');
		//   }
		// })
		// .catch(function (err) {
		//   console.log(err)
		// })

		console.log(sender)
		console.log('Get follow')

		// sendText(sender,'Get follow')
		// req.body.events[0].message.text = 'Event'
	}
	if (followid.type === 'postback') {
		console.log(sender)
		console.log('ID rich manu')

		// req.body.events[0].message.text = 'Event'
	}

	if (followid.type === 'unfollow') {
		console.log(sender)
		console.log('unfollow')

		// req.body.events[0].message.text = 'Event'
	}

	const replyToken = req.body.events[0].replyToken

	const text = req.body.events[0].message.text
	console.log(text, sender)
	console.log(typeof sender, typeof text)

	console.log(req.body.events[0])
	if (text === 'สวัสดี' || text === 'Hello' || text === 'hello') {
		console.log('massage success')
		sendText(sender, text)
	}
})

function sendText(sender: string, text: string) {
	let data = {
		to: sender,
		messages: [
			{
				type: 'text',
				text: 'สวัสดีค่ะ ',
			},
		],
	}

	const token =
		'GuB/WYYKYM3GNo6Ym44iKGGgikY215YSTcnRxaO2b0YChi8T4wk6bEI00nu0fq5oZALse0YAZP3+kLZMqOqCU5cjurs3QGHBVJkU6zo4t//dtu90DXNLP3G8osac5UKwXHbT8OaLhHNfaLpWYXd6KQdB04t89/1O/w1cDnyilFU='
	request(
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			url: 'https://api.line.me/v2/bot/message/push',
			method: 'POST',
			body: data,
			json: true,
		},
		function (err: string, res: any, body: any) {
			if (res) console.log('success')

			if (err) res.sendStatus(200), console.log('err')
			if (body) console.log(body)
		}
	)
}

app.listen(app.get('port'), function () {
	console.log('run at port', app.get('port'))
})
