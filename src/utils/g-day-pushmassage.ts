import { Request, Response } from 'express'
import request from 'request'
import { getCustomRepository } from 'typeorm'
import { ClockinRepository } from '../repository/Clock_inRepository'
import { ClockoutRepository } from '../repository/Clock_outRepository'
import { RequestRepository } from '../repository/RequestRepository'
import { UserRepository } from '../repository/UserRepository'
import config from './../configs/config'

const schedule = require('node-schedule')
const rule = new schedule.RecurrenceRule()

class Replybot {
	public async Sendmassage(req: Request, res: Response) {
		const Token = config.AUTH_LINEBOT_GDAY
		const linereq = req.body
		const idAlert = linereq.id
		const AlertHis = linereq.clockinHistory

		if (linereq.statusClockin == '1') {
			const textAlert = 'ยินดีด้วยงับๆๆ '

			request.post({
				url: config.LINE_PUSH_MESSAGE_ENDPOINT,
				headers: {
					'Content-Type': 'application/json',
					Authorization: Token,
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
					Authorization: Token,
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
		} else if (linereq.statusClockin == '2') {
			request.post({
				url: config.LINE_PUSH_MESSAGE_ENDPOINT,
				headers: {
					'Content-Type': 'application/json',
					Authorization: Token,
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
					Authorization: Token,
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
					Authorization: Token,
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
					Authorization: Token,
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
					Authorization: Token,
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
					Authorization: Token,
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
						Authorization: Token,
					},
					body: JSON.stringify({
						to: idAlert,
						messages: [
							{
								type: 'image',
								originalContentUrl:
									'https://stickershop.line-scdn.net/stickershop/v1/sticker/28816410/android/sticker.png;compress=true',
								previewImageUrl:
									'https://stickershop.line-scdn.net/stickershop/v1/sticker/28816410/android/sticker.png;compress=true',
							},
						],
					}),
				})

				request.post({
					url: config.LINE_PUSH_MESSAGE_ENDPOINT,
					headers: {
						'Content-Type': 'application/json',
						Authorization: Token,
					},
					body: JSON.stringify({
						to: idAlert,
						messages: [
							{
								type: 'text',
								text: ` แก้ไขการ Clock-out สำเร็จแล้วครับ กลับบ้านกันเถอะๆ `,
							},
						],
					}),
				})
			} else {
				request.post({
					url: config.LINE_PUSH_MESSAGE_ENDPOINT,
					headers: {
						'Content-Type': 'application/json',
						Authorization: Token,
					},
					body: JSON.stringify({
						to: idAlert,
						messages: [
							{
								type: 'image',
								originalContentUrl:
									'https://stickershop.line-scdn.net/stickershop/v1/product/1343813/LINEStorePC/main.png;compress=true',
								previewImageUrl:
									'https://stickershop.line-scdn.net/stickershop/v1/product/1343813/LINEStorePC/main.png;compress=true',
							},
						],
					}),
				})

				request.post({
					url: config.LINE_PUSH_MESSAGE_ENDPOINT,
					headers: {
						'Content-Type': 'application/json',
						Authorization: Token,
					},
					body: JSON.stringify({
						to: idAlert,
						messages: [
							{
								type: 'text',
								text: `คุณ Clock-out สำเร็จแล้ว กลับบ้านดีๆนะครับๆ `,
							},
						],
					}),
				})
			}
		}
	}

	public async RequestNotify(
		id: string,
		leavetype: string,
		leavecount: number,
		since: string,
		untill: string,
		countleave: number
	) {
		const Token = config.AUTH_LINEBOT_GDAY

		if (leavetype == 'ลาป่วย') {
			request.post({
				url: config.LINE_PUSH_MESSAGE_ENDPOINT,
				headers: {
					'Content-Type': 'application/json',
					Authorization: Token,
				},
				body: JSON.stringify({
					to: id,
					messages: [
						{
							type: 'text',
							text: `คุณได้ลาป่วยเป็นจนวน สำเร็จแล้ว หายไวๆนะครับ `,
						},
					],
				}),
			})
		} else if (leavetype == 'ลากิจ') {
			request.post({
				url: config.LINE_PUSH_MESSAGE_ENDPOINT,
				headers: {
					'Content-Type': 'application/json',
					Authorization: Token,
				},
				body: JSON.stringify({
					to: id,
					messages: [
						{
							type: 'text',
							text: `คุณได้ทำการ ลากิจสำเร็จแล้ว ขอให้เดินทางไปทำธุระปลอดภัยนะครับ `,
						},
					],
				}),
			})
		} else if (leavetype == 'Fail') {
			const ckeckfail = await getCustomRepository(UserRepository).findOne({
				UserlineId: id,
			})

			request.post({
				url: config.LINE_PUSH_MESSAGE_ENDPOINT,
				headers: {
					'Content-Type': 'application/json',
					Authorization: Token,
				},
				body: JSON.stringify({
					to: id,
					messages: [
						{
							type: 'text',
							text: `คำร้องขอการลาของคุณล้มเหลว !!! เนื่องจากจำนวนวันการลาของคุณไม่เพียงพอ #จำนวนวันลาคงเหลือ ลาป่วย : ${ckeckfail?.Sickleave} วัน , ลากิจ :  ${ckeckfail?.Onleave} วัน   `,
						},
					],
				}),
			})
		}
	}

	public TokenGDayAccess = config.AUTH_LINEBOT_GDAY
	NotifyClockin = schedule.scheduleJob('50 8 * *', async (line: string, TokenGDayAccess: any) => {
		const countlineid = await getCustomRepository(UserRepository).find({
			select: ['UserlineId'],
		})

		for (let Idline = 0; Idline < countlineid.length; Idline++) {
			line = countlineid[Idline].UserlineId

			const d = new Date()
			const datelocale = d.toLocaleDateString()
			const date = d.toDateString()
			const datenowChangetoDate = new Date(date)
			const datenow = Date.parse(datenowChangetoDate.toDateString())

			const leave = await getCustomRepository(RequestRepository).find({
				lineId: line,
			})

			if (leave) {
				const checkreq = []
				for (let countleave = 0; countleave < leave.length; countleave++) {
					const since = leave[countleave].Since
					const untill = leave[countleave].Until

					const sinceChangetoDate = new Date(since)
					const untillChangetoDate = new Date(untill)

					const dateuntill = Date.parse(untillChangetoDate.toDateString())
					const datesince = Date.parse(sinceChangetoDate.toDateString())

					if (datesince <= datenow && datenow <= dateuntill) {
						checkreq.push('found')
					} else {
						checkreq.push('notfound')
					}
				}


				if (checkreq.includes('found')) {
					TokenGDayAccess = config.AUTH_LINEBOT_GDAY
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
									type: 'image',
									originalContentUrl: 'https://fbi.dek-d.com/27/0409/6402/122616429',
									previewImageUrl: 'https://fbi.dek-d.com/27/0409/6402/122616429',
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
							to: line,
							messages: [
								{
									type: 'text',
									text: 'อรุณสวัสดิ์ครับผม',
								},
							],
						}),
					})
				} else {
					const sendlineId = await getCustomRepository(ClockinRepository).findOne({
						lineId: line,
						Date: datelocale,
					})

					if (!sendlineId) {
						TokenGDayAccess = config.AUTH_LINEBOT_GDAY
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
										type: 'image',
										originalContentUrl:
											'https://stickershop.line-scdn.net/stickershop/v1/product/11150851/LINEStorePC/main.png;compress=true',
										previewImageUrl:
											'https://stickershop.line-scdn.net/stickershop/v1/product/11150851/LINEStorePC/main.png;compress=true',
									},
								],
							}),
						})

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
											text: 'อย่าลืม Clock-in เข้างานนะคะ',
										},
									],
								}),
							})
						} catch (e) {}
					}
				}
			} else {
				const sendlineId = await getCustomRepository(ClockinRepository).findOne({
					lineId: line,
					Date: datelocale,
				})

				if (!sendlineId) {
					TokenGDayAccess = config.AUTH_LINEBOT_GDAY
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
									type: 'image',
									originalContentUrl:
										'https://stickershop.line-scdn.net/stickershop/v1/product/11150851/LINEStorePC/main.png;compress=true',
									previewImageUrl:
										'https://stickershop.line-scdn.net/stickershop/v1/product/11150851/LINEStorePC/main.png;compress=true',
								},
							],
						}),
					})

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
										text: 'อย่าลืม Clock-in เข้างานนะคะ',
									},
								],
							}),
						})
					} catch (e) {}
				}
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
				const datelocale = d.toLocaleDateString()
				const timelocale = d.toLocaleTimeString()

				const date = d.toDateString()
				const datenowChangetoDate = new Date(date)
				const datenow = Date.parse(datenowChangetoDate.toDateString())

				const leave = await getCustomRepository(RequestRepository).find({
					lineId: line,
				})

				if (leave) {
					const checkreq = []
					for (let countleave = 0; countleave < leave.length; countleave++) {
						const since = leave[countleave].Since
						const untill = leave[countleave].Until

						const sinceChangetoDate = new Date(since)
						const untillChangetoDate = new Date(untill)

						const datesince = Date.parse(sinceChangetoDate.toDateString())

						const dateuntill = Date.parse(untillChangetoDate.toDateString())

						if (datesince <= datenow && datenow <= dateuntill) {
							checkreq.push('found')
						} else {
							checkreq.push('notfound')
						}
					}

					if (!checkreq.includes('found')) {
						const sendlineId = await getCustomRepository(ClockinRepository).findOne({
							lineId: line,
							Date: datelocale,
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
								Time: timelocale,
								Date: datelocale,
								Clockin_status: UserAbsent.statusClockin,
								Clockin_history: UserAbsent.clockinHistory,
								TimeLate: UserAbsent.timeLate,
							})
						}
					}
				} else {
					const sendlineId = await getCustomRepository(ClockinRepository).findOne({
						lineId: line,
						Date: datelocale,
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
							Time: timelocale,
							Date: datelocale,
							Clockin_status: UserAbsent.statusClockin,
							Clockin_history: UserAbsent.clockinHistory,
							TimeLate: UserAbsent.timeLate,
						})
					}
				}
			}
		}
	)
}

export const replybot = new Replybot()
