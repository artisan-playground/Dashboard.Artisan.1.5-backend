import { Request, Response } from 'express'
import request from 'request'
import { getCustomRepository } from 'typeorm'
import { ClockinRepository } from '../repository/Clock_inRepository'
import { ClockoutRepository } from '../repository/Clock_outRepository'
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
													label: 'ClockIn Late',
													text: 'ClockInLate',
												},
												{
													type: 'message',
													label: 'ClockIn Forget',
													text: 'ClockInForget',
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
			} else if (reply_text == 'ClockInLate') {
				const statusClockin = '3'
				this.ClockIn(reply_token, userId, statusClockin)
			} else if (reply_text == 'ClockInForget') {
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
	public async Sendmassage(req: Request, res: Response) {
		const linereq = req.body
		const idAlert = linereq.id
		const AlertHis = linereq.clockinHistory

		if (linereq.statusClockin == '1') {
			const textAlert = 'ยินดีด้วยงับๆๆ '

			this.Alertmassage(idAlert, AlertHis, textAlert)
		} else if (linereq.statusClockin == '2') {
			request.post({
				url: config.LINE_PUSH_MESSAGE_ENDPOINT,
				headers: {
					'Content-Type': 'application/json',
					Authorization: this.TokenGDayAccess,
				},
				body: JSON.stringify({
					to: idAlert,
					messages: [
						{
							type: 'sticker',
							packageId: '11537',
							stickerId: '52002734',
						},
					],
				}),
			})

			request.post({
				url: config.LINE_PUSH_MESSAGE_ENDPOINT,
				headers: {
					'Content-Type': 'application/json',
					Authorization: this.TokenGDayAccess,
				},
				body: JSON.stringify({
					to: idAlert,
					messages: [
						{
							type: 'text',
							text: `Clock-in สำเร็จแล้ว แต่น่าเสียดาย !! คุณ Clock-in สายไป แต่ก็ไม่เกินเวลานะครับ`,
						},
					],
				}),
			})
		} else if (linereq.statusClockin == '3') {
			const textAlert = 'แต่แย่แล้ว !! '

			request.post({
				url: config.LINE_PUSH_MESSAGE_ENDPOINT,
				headers: {
					'Content-Type': 'application/json',
					Authorization: this.TokenGDayAccess,
				},
				body: JSON.stringify({
					to: idAlert,
					messages: [
						{
							type: 'sticker',
							packageId: '11538',
							stickerId: '51626522',
						},
					],
				}),
			})

			request.post({
				url: config.LINE_PUSH_MESSAGE_ENDPOINT,
				headers: {
					'Content-Type': 'application/json',
					Authorization: this.TokenGDayAccess,
				},
				body: JSON.stringify({
					to: idAlert,
					messages: [
						{
							type: 'text',
							text: `Clock-in สำเร็จแล้ว ${textAlert} คุณ Clock-in ${AlertHis} `,
						},
					],
				}),
			})
		} else if (linereq.statusClockin == '4') {
			request.post({
				url: config.LINE_PUSH_MESSAGE_ENDPOINT,
				headers: {
					'Content-Type': 'application/json',
					Authorization: this.TokenGDayAccess,
				},
				body: JSON.stringify({
					to: idAlert,
					messages: [
						{
							type: 'sticker',
							packageId: '11537',
							stickerId: '52002755',
						},
					],
				}),
			})

			request.post({
				url: config.LINE_PUSH_MESSAGE_ENDPOINT,
				headers: {
					'Content-Type': 'application/json',
					Authorization: this.TokenGDayAccess,
				},
				body: JSON.stringify({
					to: idAlert,
					messages: [
						{
							type: 'text',
							text: `Clock-in สำเร็จแล้ว  แต่ไม่น่าเลย !! คุณ ${AlertHis} `,
						},
					],
				}),
			})
		} else if (linereq.clockout == 'Success') {
			const d = new Date()
			const date = d.toLocaleDateString()
			const checkclockout = await getCustomRepository(ClockoutRepository).findOne({
				lineId: idAlert,
				Date: date,
			})

			if (checkclockout) {
				request.post({
					url: config.LINE_PUSH_MESSAGE_ENDPOINT,
					headers: {
						'Content-Type': 'application/json',
						Authorization: this.TokenGDayAccess,
					},
					body: JSON.stringify({
						to: idAlert,
						messages: [
							{
								type: 'sticker',
								packageId: '11537',
								stickerId: '52002755',
							},
						],
					}),
				})

				request.post({
					url: config.LINE_PUSH_MESSAGE_ENDPOINT,
					headers: {
						'Content-Type': 'application/json',
						Authorization: this.TokenGDayAccess,
					},
					body: JSON.stringify({
						to: idAlert,
						messages: [
							{
								type: 'text',
								text: ` แก้ไขการ Clock-out สำเร็จแล้วครับ `,
							},
						],
					}),
				})
			} else {
				request.post({
					url: config.LINE_PUSH_MESSAGE_ENDPOINT,
					headers: {
						'Content-Type': 'application/json',
						Authorization: this.TokenGDayAccess,
					},
					body: JSON.stringify({
						to: idAlert,
						messages: [
							{
								type: 'sticker',
								packageId: '11537',
								stickerId: '52002755',
							},
						],
					}),
				})

				request.post({
					url: config.LINE_PUSH_MESSAGE_ENDPOINT,
					headers: {
						'Content-Type': 'application/json',
						Authorization: this.TokenGDayAccess,
					},
					body: JSON.stringify({
						to: idAlert,
						messages: [
							{
								type: 'text',
								text: `Clock-out สำเร็จแล้วงับๆๆ `,
							},
						],
					}),
				})
			}
		}
	}

	public Alertmassage(idAlert: string, AlertHis: string, textAlert: string) {
		request.post({
			url: config.LINE_PUSH_MESSAGE_ENDPOINT,
			headers: {
				'Content-Type': 'application/json',
				Authorization: this.TokenGDayAccess,
			},
			body: JSON.stringify({
				to: idAlert,
				messages: [
					{
						type: 'sticker',
						packageId: '11537',
						stickerId: '52002734',
					},
				],
			}),
		})

		request.post({
			url: config.LINE_PUSH_MESSAGE_ENDPOINT,
			headers: {
				'Content-Type': 'application/json',
				Authorization: this.TokenGDayAccess,
			},
			body: JSON.stringify({
				to: idAlert,
				messages: [
					{
						type: 'text',
						text: `Clock-in สำเร็จแล้ว ${textAlert} คุณ Clock-in ${AlertHis} `,
					},
				],
			}),
		})
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

	NotifyClockin = schedule.scheduleJob('50 8 * * *', async (line: string, TokenGDayAccess: any) => {
		const countlineid = await getCustomRepository(UserRepository).find({
			select: ['UserlineId'],
		})

		for (let Idline = 0; Idline < countlineid.length; Idline++) {
			line = countlineid[Idline].UserlineId

			const d = new Date()

			const date = d.toLocaleDateString()

			const sendlineId = await getCustomRepository(ClockinRepository).findOne({
				lineId: line,
				Date: date,
			})

			if (!sendlineId) {
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
									text: 'อย่าลืม Clock-in เข้างานนะงับๆๆ',
								},
							],
						}),
					})
				} catch (e) {}
			}
		}
	})
	UsernotClockin = schedule.scheduleJob(
		'59 17 * * *',
		async (line: string, TokenGDayAccess: any, res: Response) => {
			const countlineid = await getCustomRepository(UserRepository).find({
				select: ['UserlineId'],
			})

			for (let Idline = 0; Idline < countlineid.length; Idline++) {
				line = countlineid[Idline].UserlineId

				const d = new Date()

				const date = d.toLocaleDateString()
				const time = d.toLocaleTimeString()
				const sendlineId = await getCustomRepository(ClockinRepository).findOne({
					lineId: line,
					Date: date,
				})

				if (!sendlineId) {
					const UserAbsent = {
						id: countlineid[Idline].UserlineId,
						distance: 'null',
						statusClockin: '5',
						clockinHistory: 'ขาด การ Clock-in',
						timeLate: 'null',
					}

					const result = await getCustomRepository(ClockinRepository).save({
						lineId: UserAbsent.id,
						Distance: UserAbsent.distance,
						Time: time,
						Date: date,
						Clockin_status: UserAbsent.statusClockin,
						Clockin_history: UserAbsent.clockinHistory,
						TimeLate: UserAbsent.timeLate,
					})
				}
			}
		}
	)
}

export const gDayBot = new GDayBot()
