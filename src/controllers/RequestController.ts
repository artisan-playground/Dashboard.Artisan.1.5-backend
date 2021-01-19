import { Advised } from 'aspect.js'
import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { Requests } from '../models/Request'
import { RequestRepository } from '../repository/RequestRepository'
const fs = require('fs')
const { google } = require('googleapis')
let rawdata = fs.readFileSync('dashboard.json')
let keyCalendar = JSON.parse(rawdata)

@Advised()
class RequestController {
	public async creatReq(req: Request, res: Response): Promise<Response> {
		const requests: Requests = req.body

		const result = await getCustomRepository(RequestRepository).clockreq(requests)

		if (result) {
			return res.status(200).json({
				responseBody: result,
				message: `success`,
				responseCode: 200,
			})
		} else {
			return res.status(200).json({
				responseBody: result,
				message: `fail`,
				responseCode: 401,
			})
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
			maxResults: 5,
		})
		const result = response.data.items

		return res.status(200).json({
			responseBody: result,
			responseCode: 200,
		})
	}
}
export const requestController = new RequestController()
