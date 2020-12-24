import { Request, Response } from 'express'
import request from 'request'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../repository/UserRepository'
import config from './../configs/config'

class GDayBot {
	public TokenGDayAccess = config.AUTH_LINEBOT_GDAY
	public async listenerWebHook(req: Request, res: Response) {
		const reply_token: string = req.body.events[0].replyToken
		const reply_text: string = req.body.events[0].message.text
		const userId = req.body.events[0].source.userId
		const getUser = await getCustomRepository(UserRepository).findOne({ UserlineId: userId })
		console.log(getUser)

		if (getUser) {
			if (reply_text == 'Clock-in') {
				this.ClockIn(reply_token, userId)
			} else if (reply_text == 'Clock-out') {
				this.ClockOut(reply_token, userId)
			} else if (reply_text == 'Request') {
				this.Request(reply_token, userId)
			} else if (reply_text == 'Project') {
				this.Project(reply_token, userId)
			} else {
				request.post({
					url: config.LINE_PUSH_MESSAGE_ENDPOINT,
					headers: {
						'Content-Type': 'application/json',
						Authorization: this.TokenGDayAccess,
					},
					body: JSON.stringify({
						replyToken: reply_token,
						to: userId,
						messages: [
							{
								type: 'text',
								text: 'ลองใหม่อีกครั้ง',
							},
						],
					}),
				})
			}
		} else {
			this.registerResponse(reply_token, userId)
		}

		return res.status(200).json({})
	}

	public ClockIn(reply_token: string, userId: string) {
		const headers = {
			'Content-Type': 'application/json',
			Authorization: this.TokenGDayAccess,
		}
		const body = JSON.stringify({
			replyToken: reply_token,
			to: userId,
			messages: [
				{
					// type: 'text',

					// text: `Go to location`,

					type: 'template',
					altText: 'this is a buttons template',
					template: {
						type: 'buttons',
						thumbnailImageUrl: 'https://www.prosoftgps.com/upload/6155/5W5b86scfv.png',
						imageBackgroundColor: '#A9F100',
						title: '                         Clock In Now !',
						text: 'Do you want to Clockin now ? ',
						actions: [
							{
								type: 'uri',
								label: 'Go',
								uri: `https://webhook.artisandigital.tech/clock-in?id=${userId}`,
							},
						],
					},

					// type: 'template',
					// altText: 'clock-in',
					// template: {
					// 	backgroundColor: '#000',
					// 	type: 'buttons',
					// 	title: 'Clock-in',
					// 	text: `click เพื่อ clock-in`,
					// 	actions: [
					// 		{
					// 			type: 'uri',
					// 			label: 'click',
					// 			uri: `https://webhook.artisandigital.tech/clock-in?id=${userId}`,
					// 		},
					// 	],
					// },
				},
			],
		})
		request.post({
			url: config.LINE_PUSH_MESSAGE_ENDPOINT,
			headers: headers,
			body: body,
		})
	}

	public ClockOut(reply_token: string, userId: string) {
		const headers = {
			'Content-Type': 'application/json',
			Authorization: this.TokenGDayAccess,
		}
		const body = JSON.stringify({
			replyToken: reply_token,
			to: userId,
			messages: [
				{
					// type: 'text',

					// text: `Go to Daily`,
					type: 'template',
					altText: 'this is a buttons template',
					template: {
						type: 'buttons',
						thumbnailImageUrl:
							'https://image.freepik.com/free-vector/businessman-running-exit-door-sign-he-get-off-work_115990-136.jpg',
						imageBackgroundColor: '#A9F100',
						title: '                         Clock Out Now !',
						text: 'Do you want to ClockOut now ? ',
						actions: [
							{
								type: 'uri',
								label: 'Go',
								uri: `https://webhook.artisandigital.tech/clock-in?id=${userId}`,
							},
						],
					},

					// type: 'template',
					// altText: 'clock-in',
					// template: {
					// 	backgroundColor: '#000',
					// 	type: 'buttons',
					// 	title: 'Clock-in',
					// 	text: `click เพื่อ Daily`,
					// 	actions: [
					// 		{
					// 			type: 'uri',
					// 			label: 'click',
					// 			uri: `https://webhook.artisandigital.tech/clock-in?id=${userId}`,
					// 		},
					// 	],
					// },
				},
			],
		})
		request.post({
			url: config.LINE_PUSH_MESSAGE_ENDPOINT,
			headers: headers,
			body: body,
		})
	}
	public Request(reply_token: string, userId: string) {
		const headers = {
			'Content-Type': 'application/json',
			Authorization: this.TokenGDayAccess,
		}
		const body = JSON.stringify({
			replyToken: reply_token,
			to: userId,
			messages: [
				{
					// type: 'text',

					// text: `Go to Request`,
					type: 'template',
					altText: 'this is a buttons template',
					template: {
						type: 'buttons',
						thumbnailImageUrl:
							'https://playtech.ro/stiri/wp-content/uploads/2020/08/Concedii-medicale-Rom%C3%A2nia.-Schimb%C4%83ri-importante-%C3%AEn-UE-%C8%99i-%C3%AEn-%C8%9Bara-noastr%C4%83.-Ce-trebuie-s%C4%83-%C8%99tim-din-acest-moment.jpg',
						imageBackgroundColor: '#A9F100',
						title: '                         Request Now !',
						text: 'Do you want to Request now ? ',
						actions: [
							{
								type: 'uri',
								label: 'Go',
								uri: `https://webhook.artisandigital.tech/clock-in?id=${userId}`,
							},
						],
					},

					// type: 'template',
					// altText: 'clock-in',
					// template: {
					// 	backgroundColor: '#000',
					// 	type: 'buttons',
					// 	title: 'Clock-in',
					// 	text: `click เพื่อ Request`,
					// 	actions: [
					// 		{
					// 			type: 'uri',
					// 			label: 'click',
					// 			uri: `https://webhook.artisandigital.tech/clock-in?id=${userId}`,
					// 		},
					// 	],
					// },
				},
			],
		})
		request.post({
			url: config.LINE_PUSH_MESSAGE_ENDPOINT,
			headers: headers,
			body: body,
		})
	}
	public Project(reply_token: string, userId: string) {
		const headers = {
			'Content-Type': 'application/json',
			Authorization: this.TokenGDayAccess,
		}
		const body = JSON.stringify({
			replyToken: reply_token,
			to: userId,
			messages: [
				{
					// type: 'text',

					// text: `Go to Request`,
					type: 'template',
					altText: 'this is a buttons template',
					template: {
						type: 'buttons',
						thumbnailImageUrl: 'https://shit.management/content/images/2019/07/team_work.jpg',
						imageBackgroundColor: '#A9F100',
						title: '                         Project Now !',
						text: 'Do you want to Project now ? ',
						actions: [
							{
								type: 'uri',
								label: 'Go',
								uri: `https://webhook.artisandigital.tech/clock-in?id=${userId}`,
							},
						],
					},

					// type: 'template',
					// altText: 'clock-in',
					// template: {
					// 	backgroundColor: '#000',
					// 	type: 'buttons',
					// 	title: 'Clock-in',
					// 	text: `click เพื่อ Request`,
					// 	actions: [
					// 		{
					// 			type: 'uri',
					// 			label: 'click',
					// 			uri: `https://webhook.artisandigital.tech/clock-in?id=${userId}`,
					// 		},
					// 	],
					// },
				},
			],
		})
		request.post({
			url: config.LINE_PUSH_MESSAGE_ENDPOINT,
			headers: headers,
			body: body,
		})
	}
	public registerResponse(reply_token: string, userId: string) {
		const headers = {
			'Content-Type': 'application/json',
			Authorization: this.TokenGDayAccess,
		}
		const body = JSON.stringify({
			replyToken: reply_token,
			to: userId,
			messages: [
				{
					type: 'text',

					text: `https://webhook.artisandigital.tech?id=${userId}`,
					// type: 'template',
					// altText: 'ลงทะเบียนสมาชิก',
					// template: {
					// 	backgroundColor: '#000',
					// 	type: 'buttons',
					// 	title: 'กรุณาลงทะเบียน',
					// 	text: `กรุณาสมัครสมาชิกก่อนใช้บริการ`,
					// 	actions: [
					// 		{
					// 			type: 'uri',
					// 			label: 'สมัครสมาชิก',
					// 			uri: `https://hook.artisandigital.tech/register?id=${userId}`,
					// 		},
					// 	],
					// },
				},
			],
		})
		request.post({
			url: config.LINE_PUSH_MESSAGE_ENDPOINT,
			headers: headers,
			body: body,
		})
	}
}

export const gDayBot = new GDayBot()
