import { Advised } from 'aspect.js'
import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { Requests } from '../models/Request'
import { RequestRepository } from '../repository/RequestRepository'
import { UserRepository } from '../repository/UserRepository'
import { replybot } from '../utils/g-day-pushmassage'

const fs = require('fs')
const { google } = require('googleapis')
let rawdata = fs.readFileSync('dashboard.json')
let keyCalendar = JSON.parse(rawdata)
const SCOPES = 'https://www.googleapis.com/auth/calendar'
const calendar = google.calendar({ version: 'v3' })
const auth = new google.auth.JWT(keyCalendar.client_email, null, keyCalendar.private_key, SCOPES)

@Advised()
class RequestController {
	public async creatReq(req: Request, res: Response) {
		const requests: Requests = req.body
		const id = requests.lineId
		const countLeave = requests.CountLeave

		if (requests.Leavetype == 'ลาป่วย') {
			const getrequest = await getCustomRepository(UserRepository).findOne({
				UserlineId: id,
			})

			if (typeof getrequest?.Sickleave === 'number') {
				const countDB: number = getrequest?.Sickleave

				if (countDB != 0 && countDB >= countLeave) {
					const remain = countDB - countLeave

					const Editresult = await getCustomRepository(UserRepository).update(getrequest?.userId, {
						Sickleave: remain,
					})

					if (Editresult) {
						const reqsuccess = await getCustomRepository(UserRepository).findOne({
							userId: getrequest?.userId,
						})

						if (typeof reqsuccess?.UserlineId === 'string') {
							const id: string = reqsuccess?.UserlineId
							const leavetype = requests.Leavetype
							const leavecount = reqsuccess?.Sickleave

							replybot.RequestNotify(id, leavetype, leavecount)
						}
					}

					const result = await getCustomRepository(RequestRepository).clockreq(requests)
				} else {
					const reqfail = await getCustomRepository(UserRepository).findOne({
						userId: getrequest?.userId,
					})

					if (typeof reqfail?.UserlineId === 'string') {
						const id: string = reqfail?.UserlineId
						const leavetype = 'Fail'
						const leavecount = reqfail?.Sickleave

						replybot.RequestNotify(id, leavetype, leavecount)
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
					const remain = countDB - countLeave

					const Editresult = await getCustomRepository(UserRepository).update(getrequest?.userId, {
						Onleave: remain,
					})

					if (Editresult) {
						const reqsuccess = await getCustomRepository(UserRepository).findOne({
							userId: getrequest?.userId,
						})

						if (typeof reqsuccess?.UserlineId === 'string') {
							const id: string = reqsuccess?.UserlineId
							const leavetype = requests.Leavetype
							const leavecount = reqsuccess?.Onleave

							replybot.RequestNotify(id, leavetype, leavecount)
						}
					}

					const result = await getCustomRepository(RequestRepository).clockreq(requests)
				} else {
					const reqfail = await getCustomRepository(UserRepository).findOne({
						userId: getrequest?.userId,
					})

					if (typeof reqfail?.UserlineId === 'string') {
						const id: string = reqfail?.UserlineId
						const leavetype = 'Fail'
						const leavecount = reqfail?.Onleave

						replybot.RequestNotify(id, leavetype, leavecount)
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
