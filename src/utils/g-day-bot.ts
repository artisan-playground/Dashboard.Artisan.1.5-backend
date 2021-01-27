import { Request, Response } from 'express'
import request from 'request'
import { getCustomRepository } from 'typeorm'
import { ClockinRepository } from '../repository/Clock_inRepository'
import { UserRepository } from '../repository/UserRepository'
import config from './../configs/config'

const moment = require('moment')
const schedule = require('node-schedule')
const rule = new schedule.RecurrenceRule()

class GDayBot {
	public TokenGDayAccess = config.AUTH_LINEBOT_GDAY
	public async listenerWebHook(req: Request, res: Response) {
		const reply_token: string = req.body.events[0].replyToken
		const reply_text: string = req.body.events[0].message.text
		const userId = req.body.events[0].source.userId
		const Currenttime = `${new Date().toDateString()} ${new Date().toTimeString()}`
		const Clockintime = `${new Date().toDateString()} 9:15:00`
		const Clockintimelate = `${new Date().toDateString()} 10:00:00`
		const Clockintimelimit = `${new Date().toDateString()} 18:00:00`

		const getUser = await getCustomRepository(UserRepository).findOne({ UserlineId: userId })

		if (getUser) {
			if (reply_text == 'Clock-in') {
				const d = new Date()
				const date = d.toLocaleDateString()
				const checkclockIn = await getCustomRepository(ClockinRepository).findOne({
					lineId: userId,
					Date: date,
				})

				if (checkclockIn) {
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
									text: 'คุณ Clock-in ไปแล้ววันนี้งับๆ ',
								},
							],
						}),
					})
				} else {
					if (
						Date.parse(Currenttime) > Date.parse(Clockintime) &&
						Date.parse(Currenttime) < Date.parse(Clockintimelate)
					) {
						const statusClockin = '2'
						this.ClockIn(reply_token, userId, statusClockin)
					} else if (Date.parse(Currenttime) < Date.parse(Clockintime)) {
						const statusClockin = '1'
						this.ClockIn(reply_token, userId, statusClockin)
					} else if (
						Date.parse(Currenttime) > Date.parse(Clockintimelate) &&
						Date.parse(Currenttime) < Date.parse(Clockintimelimit)
					) {
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
										type: 'template',
										altText: 'this is a buttons template',
										template: {
											type: 'buttons',
											thumbnailImageUrl:
												'https://mediacloud.kiplinger.com/image/private/s--hZBWpVc2--/v1603676868/ForgetWoman.jpg',
											imageBackgroundColor: '#F30000',
											title: 'Clock-In Forget',
											text: 'You Clock-in exceeded the time limit !! ',
											actions: [
												{
													type: 'message',
													label: 'Clock-In Late',
													text: 'Clock-InLate',
												},
												{
													type: 'message',
													label: 'Clock-In Forget',
													text: 'Clock-In Forget',
												},
											],
										},
									},
								],
							}),
						})
					} else if (Date.parse(Currenttime) > Date.parse(Clockintimelimit)) {
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
										text: 'วันนี้หมดเวลา Clock-in แล้วเน้อออ !!',
									},
								],
							}),
						})
					}
				}
			} else if (reply_text == 'Clock-InLate') {
				const statusClockin = '3'
				this.ClockIn(reply_token, userId, statusClockin)
			} else if (reply_text == 'Clock-InForget') {
				const statusClockin = '4'
				this.ClockIn(reply_token, userId, statusClockin)
			} else if (reply_text == 'Clock-out') {
				const d = new Date()
				const date = d.toLocaleDateString()
				const checkclockIn = await getCustomRepository(ClockinRepository).findOne({
					lineId: userId,
					Date: date,
				})

				if (checkclockIn) {
					if (checkclockIn.Distance == 'null') {
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
										text:
											'วันนี้คุณได้ ขาดงาน ไปแล้ว เนื่องจากไม่ได้ทำการ Clock-in ตามเวลาที่กำหนดครับ ',
									},
								],
							}),
						})
					} else {
						this.ClockOut(reply_token, userId)
					}
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
									text: 'กรุณาทำการ Clock-in ในวันนี้ก่อน ',
								},
							],
						}),
					})
				}
			} else if (reply_text == 'Request') {
				if (getUser?.status == 'admin') {
					const status = '1'
					this.Request(reply_token, userId, status)
				} else {
					const status = '2'
					this.Request(reply_token, userId, status)
				}
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

	public ClockIn(reply_token: string, userId: string, statusClockin: string) {
		const headers = {
			'Content-Type': 'application/json',
			Authorization: this.TokenGDayAccess,
		}

		const body = JSON.stringify({
			to: userId,
			messages: [
				{
					type: 'template',
					altText: 'this is an image carousel template',
					template: {
						type: 'carousel',
						imageSize: 'cover',
						columns: [
							{
								thumbnailImageUrl: 'https://www.prosoftgps.com/upload/6155/5W5b86scfv.png',
								text: '           Do you want to clock-in  ? ',
								actions: [
									{
										type: 'uri',
										label: 'Clock-in Here !',
										uri: `https://dashboard-web-15-dev.artisandigital.xyz/Clockin?id=${userId}&&statusClockin=${statusClockin}`,
									},
								],
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
					type: 'template',
					altText: 'this is an image carousel template',
					template: {
						type: 'carousel',
						imageSize: 'cover',
						columns: [
							{
								thumbnailImageUrl:
									'https://image.freepik.com/free-vector/businessman-running-exit-door-sign-he-get-off-work_115990-136.jpg',
								text: '         Do you want to clock-out  ? ',
								actions: [
									{
										type: 'uri',
										label: 'Clock-out Here !',
										uri: `https://dashboard-web-15-dev.artisandigital.xyz/Vatsclockout?id=${userId}`,
									},
								],
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
	public Request(reply_token: string, userId: string, status: string) {
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
								uri: `https://dashboard-web-15-dev.artisandigital.xyz/Vleaveform?id=${userId}&&status=${status}`,
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
					altText: 'this is an image carousel template',
					template: {
						type: 'carousel',
						imageSize: 'cover',
						columns: [
							{
								thumbnailImageUrl:
									'https://agora.rovernet.eu/wp-content/uploads/2020/01/Registration.jpeg',
								text: '        Press the button to Register !',
								actions: [
									{
										type: 'uri',
										label: 'Register Now !',
										uri: `https://dashboard-web-15-dev.artisandigital.xyz/Vatslogin?id=${userId}`,
									},
								],
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
}

export const gDayBot = new GDayBot()
