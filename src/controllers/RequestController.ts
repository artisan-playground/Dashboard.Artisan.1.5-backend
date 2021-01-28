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

@Advised()
class RequestController {
	public async creatReq(req: Request, res: Response) {
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

					replybot.Adminpushmassage(
						name,
						id,
						leavetype,
						leavecount,
						since,
						untill,
						countleave,
						Leaveevent,
						timeperiod
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

					replybot.Adminpushmassage(
						name,
						id,
						leavetype,
						leavecount,
						since,
						untill,
						countleave,
						Leaveevent,
						timeperiod
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
	public async Addrequest(
		countleave: number,
		leavetype: string,
		iduserrequest: string,
		Request: any
	) {
		const getrequest = await getCustomRepository(UserRepository).findOne({
			UserlineId: iduserrequest,
		})
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

	public async getEvents(req: Request, res: Response) {
		const SCOPES = 'https://www.googleapis.com/auth/calendar'
		const calendar = google.calendar({ version: 'v3' })

		const auth = new google.auth.JWT(
			keyCalendar.client_email,
			null,
			keyCalendar.private_key,
			SCOPES
		)
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
