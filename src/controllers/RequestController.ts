import { Advised } from 'aspect.js'
import { Request, Response } from 'express'
import request from 'request'
import { getCustomRepository } from 'typeorm'
import { Requests } from '../models/Request'
import { RequestRepository } from '../repository/RequestRepository'
import { UserRepository } from '../repository/UserRepository'
import { replybot } from '../utils/g-day-pushmassage'
import config from './../configs/config'

const fs = require('fs')
const { google } = require('googleapis')
let rawdata = fs.readFileSync('dashboard.json')
let keyCalendar = JSON.parse(rawdata)
const SCOPES = 'https://www.googleapis.com/auth/calendar'
const calendar = google.calendar({ version: 'v3' })
const auth = new google.auth.JWT(keyCalendar.client_email, null, keyCalendar.private_key, SCOPES)

@Advised()
class RequestController {
	public async UserReq(req: Request, res: Response) {
		const requests: Requests = req.body

		const id = requests.lineId
		const countLeave = requests.CountLeave
		const Leaveevent = requests.Leaveevent
		if (requests.Leavetype == 'ลาป่วย') {
			const getrequest = await getCustomRepository(UserRepository).findOne({
				UserlineId: id,
			})

			if (typeof getrequest?.Sickleave === 'number') {
				const countDB: number = getrequest?.Sickleave

				if (countDB != 0 && countDB >= countLeave) {
					const id: string = getrequest?.UserlineId
					const name = getrequest?.name
					const leavetype = requests.Leavetype
					const leavecount = getrequest?.Sickleave
					const since = requests.Since
					const untill = requests.Until
					const countleave = requests.CountLeave
					const timeperiod = requests.Timeperiod
					const checkUnconfirm = 'first'

					replybot.Adminpushmassage(
						name,
						id,
						leavetype,
						leavecount,
						since,
						untill,
						countleave,
						Leaveevent,
						timeperiod,
						checkUnconfirm
					)
				} else {
					const reqfail = await getCustomRepository(UserRepository).findOne({
						userId: getrequest?.userId,
					})

					if (typeof reqfail?.UserlineId === 'string') {
						const id: string = reqfail?.UserlineId
						const leavetype = 'Fail'
						const leavecount = reqfail?.Sickleave
						const since = requests.Since
						const untill = requests.Until
						const countleave = requests.CountLeave

						replybot.RequestNotify(id, leavetype, leavecount, since, untill, countleave)
					}
				}
			}
		} else if (requests.Leavetype == 'ลากิจ') {
			const getrequest = await getCustomRepository(UserRepository).findOne({
				UserlineId: id,
			})

			if (typeof getrequest?.Onleave === 'number') {
				const countDB: number = getrequest?.Onleave

				if (countDB != 0 && countDB >= countLeave) {
					const id: string = getrequest?.UserlineId
					const name = getrequest?.name
					const leavetype = requests.Leavetype
					const leavecount = getrequest?.Onleave
					const since = requests.Since
					const untill = requests.Until
					const countleave = requests.CountLeave
					const timeperiod = requests.Timeperiod
					const checkUnconfirm = 'first'

					replybot.Adminpushmassage(
						name,
						id,
						leavetype,
						leavecount,
						since,
						untill,
						countleave,
						Leaveevent,
						timeperiod,
						checkUnconfirm
					)
				} else {
					const reqfail = await getCustomRepository(UserRepository).findOne({
						userId: getrequest?.userId,
					})

					if (typeof reqfail?.UserlineId === 'string') {
						const id: string = reqfail?.UserlineId
						const leavetype = 'Fail'
						const leavecount = reqfail?.Onleave
						const since = requests.Since
						const untill = requests.Until
						const countleave = requests.CountLeave

						replybot.RequestNotify(id, leavetype, leavecount, since, untill, countleave)
					}
				}
			}
		}
	}
	public async AdminReq(req: Request, res: Response) {
		const requests: Requests = req.body
		const id = requests.lineId
		const countLeave = requests.CountLeave
		const Admibreq = req.body
		const leaveList = req.body.leaveList

		const countList = leaveList.length
		const Token = config.AUTH_LINEBOT_GDAY
		const admindata = await getCustomRepository(UserRepository).findOne({ UserlineId: id })
		const adminname = admindata?.name

		if (requests.Leavetype == 'ลาป่วย') {
			for (let count = 0; count < countList; count++) {
				const emailuser = leaveList[count]
				const getemailrequest = await getCustomRepository(UserRepository).findOne({
					username: emailuser,
				})
				const usernamereq = getemailrequest?.name
				const countDB = getemailrequest?.Sickleave

				const id = getemailrequest?.userId
				if (typeof countDB === 'number') {
					const remain = countDB - countLeave

					if (typeof id === 'number') {
						const Editresult = await getCustomRepository(UserRepository).update(id, {
							Sickleave: remain,
						})
						if (Editresult) {
							const adminreq = {
								lineId: getemailrequest?.UserlineId,
								Leavetype: Admibreq.Leavetype,
								Timeperiod: Admibreq.Timeperiod,
								Since: Admibreq.Since,
								Until: Admibreq.Until,
								CountLeave: Admibreq.CountLeave,
								Leaveevent: Admibreq.Leaveevent,
								Leavefor: admindata?.name,
							}
							const result = await getCustomRepository(RequestRepository).Adminadd(adminreq)
							if (result) {
								request.post({
									url: config.LINE_PUSH_MESSAGE_ENDPOINT,
									headers: {
										'Content-Type': 'application/json',
										Authorization: Token,
									},
									body: JSON.stringify({
										to: getemailrequest?.UserlineId,
										messages: [
											{
												type: 'text',
												text: `คุณได้รับการลาให้จาก admin ${adminname} แล้ว!!!`,
											},
										],
									}),
								})
								const countlineid = await getCustomRepository(UserRepository).find({
									select: ['UserlineId'],
									where: [{ status: 'admin' }],
								})

								for (let Idline = 0; Idline < countlineid.length; Idline++) {
									const line = countlineid[Idline].UserlineId

									request.post({
										url: config.LINE_PUSH_MESSAGE_ENDPOINT,
										headers: {
											'Content-Type': 'application/json',
											Authorization: Token,
										},
										body: JSON.stringify({
											to: line,
											messages: [
												{
													type: 'text',
													text: `แอดมิน ${adminname} ได้ทำการ ${Admibreq.Leavetype} ให้คุณ ${usernamereq}`,
												},
											],
										}),
									})
								}
							}
						}
					}
				}
			}
		} else if (requests.Leavetype == 'ลากิจ') {
			for (let count = 0; count < countList; count++) {
				const emailuser = leaveList[count]
				const getemailrequest = await getCustomRepository(UserRepository).findOne({
					username: emailuser,
				})
				const usernamereq = getemailrequest?.name
				const countDB = getemailrequest?.Onleave

				const id = getemailrequest?.userId
				if (typeof countDB === 'number') {
					const remain = countDB - countLeave

					if (typeof id === 'number') {
						const Editresult = await getCustomRepository(UserRepository).update(id, {
							Onleave: remain,
						})
						if (Editresult) {
							const adminreq = {
								lineId: getemailrequest?.UserlineId,
								Leavetype: Admibreq.Leavetype,
								Timeperiod: Admibreq.Timeperiod,
								Since: Admibreq.Since,
								Until: Admibreq.Until,
								CountLeave: Admibreq.CountLeave,
								Leaveevent: Admibreq.Leaveevent,
							}
							const result = await getCustomRepository(RequestRepository).Adminadd(adminreq)
							if (result) {
								request.post({
									url: config.LINE_PUSH_MESSAGE_ENDPOINT,
									headers: {
										'Content-Type': 'application/json',
										Authorization: Token,
									},
									body: JSON.stringify({
										to: getemailrequest?.UserlineId,
										messages: [
											{
												type: 'text',
												text: `คุณได้รับการลาให้จาก admin ${adminname} แล้ว!!!`,
											},
										],
									}),
								})
								const countlineid = await getCustomRepository(UserRepository).find({
									select: ['UserlineId'],
									where: [{ status: 'admin' }],
								})

								for (let Idline = 0; Idline < countlineid.length; Idline++) {
									const line = countlineid[Idline].UserlineId

									request.post({
										url: config.LINE_PUSH_MESSAGE_ENDPOINT,
										headers: {
											'Content-Type': 'application/json',
											Authorization: Token,
										},
										body: JSON.stringify({
											to: line,
											messages: [
												{
													type: 'text',
													text: `แอดมิน ${adminname} ได้ทำการ ${Admibreq.Leavetype} ให้คุณ ${usernamereq}`,
												},
											],
										}),
									})
								}
							}
						}
					}
				}
			}
		}
	}

	public async Addrequest(
		countleave: number,
		leavetype: string,
		iduserrequest: string,
		Request: any
	) {
		const getrequest = await getCustomRepository(UserRepository).findOne({
			UserlineId: iduserrequest,
		})
		Request.Leavefor = getrequest?.name

		if (leavetype == 'ลาป่วย') {
			const countDB = getrequest?.Sickleave
			const id = getrequest?.userId

			if (typeof countDB === 'number') {
				const remain = countDB - countleave

				if (typeof id === 'number') {
					const Editresult = await getCustomRepository(UserRepository).update(id, {
						Sickleave: remain,
					})

					if (Editresult) {
						const result = await getCustomRepository(RequestRepository).clockreq(Request)
					}
				}
			}
		} else if (leavetype == 'ลากิจ') {
			const countDB = getrequest?.Onleave
			const id = getrequest?.userId

			if (typeof countDB === 'number') {
				const remain = countDB - countleave

				if (typeof id === 'number') {
					const Editresult = await getCustomRepository(UserRepository).update(id, {
						Onleave: remain,
					})

					if (Editresult) {
						const result = await getCustomRepository(RequestRepository).clockreq(Request)
					}
				}
			}
		}
	}
	public async gatdataRequset(req: Request, res: Response): Promise<Response> {
		const requests: Requests = req.body

		const result = await getCustomRepository(RequestRepository).getdataRequset(requests)

		return res.status(200).json({
			responseBody: result,
			responseCode: 200,
		})
	}

	public async createEvents(req: Request, res: Response): Promise<Response> {
		const requests: Requests = req.body

		let event = {
			summary: `${req.body.Sammary}`,
			description: `${req.body.description}`,
			start: {
				dateTime: `${req.body.Since}`,
				timeZone: 'Asia/Bangkok',
			},
			end: {
				dateTime: `${req.body.Until}`,
				timeZone: 'Asia/Bangkok',
			},
			colorId: '5',
		}

		let response = await calendar.events.insert(
			{
				auth: auth,
				calendarId: keyCalendar.CalendarID,
				resource: event,
			},
			(err: object, event: object) => {
				if (err) {
					console.log('There was an error contacting the Calendar service: ' + err)
					return
				}
				console.log('Event created: %s', event)
			}
		)

		return res.status(200).json({
			responseBody: response,
			responseCode: 200,
		})
	}

	public async getEvents(req: Request, res: Response) {
		const date = new Date()
		const year = `${date.getFullYear()}`
		let mount = `${date.getMonth() + 1}`
		let day = `${date.getDate()}`
		if (parseInt(mount) < 10) {
			mount = `0${mount}`
		}
		if (parseInt(day) < 10) {
			day = `0${day}`
		}

		const dateTime = `${year}-${mount}-${day}T00:00:01+07:00`

		const response = await calendar.events.list({
			auth: auth,
			calendarId: keyCalendar.CalendarID,
			timeMin: dateTime,
			timeZone: 'Asia/Bangkok',
			singleEvents: true,
			orderBy: 'startTime',
		})
		const result = response.data.items

		return res.status(200).json({
			responseBody: result,
			responseCode: 200,
		})
	}
}
export const requestController = new RequestController()
