import { Request, Response } from 'express'
import request from 'request'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../repository/UserRepository'
import config from './../configs/config'

const moment = require('moment')
const schedule = require('node-schedule')
const rule = new schedule.RecurrenceRule()
rule.minute = 1

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
		console.log(this.TokenGDayAccess)

		const body = JSON.stringify({
			to: userId,
			messages: [
				{


					type: 'template',
					altText: 'this is a buttons template',
					template: {
						type: 'buttons',
						thumbnailImageUrl: 'https://www.prosoftgps.com/upload/6155/5W5b86scfv.png',
						imageBackgroundColor: '#A9F100',
						title: '                         Clock In !',
						text: 'Do you want to Clockin now ? ',
						actions: [
							{
								type: 'uri',
								label: 'Go',
								uri: `https://nook.artisandigital.tech/Clockin?id=${userId}`,
							},
						],
					},
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
						title: '                         Clock Out !',
						text: 'Do you want to ClockOut now ? ',
						actions: [
							{
								type: 'uri',
								label: 'Go',
								uri: `https://nook.artisandigital.tech/Vatsclockout?id=${userId}`,
							},
						],
					},
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

					type: 'template',
					altText: 'this is a buttons template',
					template: {
						type: 'buttons',
						thumbnailImageUrl:
							'https://playtech.ro/stiri/wp-content/uploads/2020/08/Concedii-medicale-Rom%C3%A2nia.-Schimb%C4%83ri-importante-%C3%AEn-UE-%C8%99i-%C3%AEn-%C8%9Bara-noastr%C4%83.-Ce-trebuie-s%C4%83-%C8%99tim-din-acest-moment.jpg',
						imageBackgroundColor: '#A9F100',
						title: '                         Request !',
						text: 'Do you want to Request now ? ',
						actions: [
							{
								type: 'uri',
								label: 'Go',
								uri: `https://nook.artisandigital.tech/Vleaveform?id=${userId}`,
							},
						],
					},
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
						title: '                         Project !',
						text: 'Do you want to Project now ? ',
						actions: [
							{
								type: 'uri',
								label: 'Go',
								uri: `https://webhook.artisandigital.tech/clock-in?id=${userId}`,
							},
						],
					},
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

					type: 'template',
					altText: 'this is a buttons template',
					template: {
						type: 'buttons',
						thumbnailImageUrl:
							'https://agora.rovernet.eu/wp-content/uploads/2020/01/Registration.jpeg',
						imageBackgroundColor: '#A9F100',

						title: '                         Register !',
						weight: 'bold',
						size: 'xl',
						text: 'กรุณายืนยันตัวตนในการเข้าใช้งาน ? ',
						actions: [
							{
								type: 'uri',
								label: 'ยืนยัน',
								uri: `https://nook.artisandigital.tech/Vatslogin?id=${userId}`,
							},
						],
					},
				},
			],
		})
		request.post({
			url: config.LINE_PUSH_MESSAGE_ENDPOINT,
			headers: headers,
			body: body,
		})
	}

	event = schedule.scheduleJob('*/1 * * * *', async (line: string, TokenGDayAccess: any) => {


		line = 'U3ef5f557fecc78c5af1f95a703865b8b'
		TokenGDayAccess = config.AUTH_LINEBOT_GDAY

		try {


			request.post({
				url: config.LINE_PUSH_MESSAGE_ENDPOINT,
				headers: {
					'Content-Type': 'application/json',
					Authorization: this.TokenGDayAccess,
				},
				body: JSON.stringify({
					to: line,
					messages: [
						{
							type: 'text',
							text: 'แจ้งเตือนนน',
						},
					],
				}),
			})
		} catch (e) {
			console.error(e)
		}
	})
}

export const gDayBot = new GDayBot()
