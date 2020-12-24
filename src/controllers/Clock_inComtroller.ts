import { Advised } from 'aspect.js'
import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { Clockin } from '../models/Clock-in'
import { User } from '../models/User'
import { ClockinRepository } from '../repository/Clock_inRepository'
import { UserRepository } from '../repository/UserRepository'

@Advised()
class ClockinController {
	public async creatCI(req: Request, res: Response): Promise<Response> {
		const clock_in: Clockin = req.body

		const getData = await getCustomRepository(UserRepository).findOne({
			UserlineId: clock_in.lineId,
		})
		console.log('User input', clock_in)
		console.log('data base', getData)
		// console.log('....', getData?.UserlineId)
		const nUser = new User()

		if (clock_in.lineId == getData?.UserlineId) {
			nUser.userId = getData.userId
		}

		const d = new Date()
		const time = d.toLocaleTimeString()
		const date = d.toLocaleDateString()

		clock_in.Distance = '200'

		clock_in.Time = time
		clock_in.Date = date

		const result = await getCustomRepository(ClockinRepository).clockin(clock_in)
		console.log(777, result)
		console.log(time)
		console.log(date)

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
}
export const clockinController = new ClockinController()
