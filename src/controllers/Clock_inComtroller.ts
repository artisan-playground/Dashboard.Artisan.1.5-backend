import { Advised } from 'aspect.js'
import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { Clockin } from '../models/Clock-in'
import { ClockinRepository } from '../repository/Clock_inRepository'

@Advised()
class ClockinController {
	public async creatCI(req: Request, res: Response): Promise<Response> {
		const clock_in: Clockin = req.body

		console.log('User input', clock_in)

		clock_in.lineId = 'hhhhdasdasdasdas'
		const d = new Date()
		const time = d.toLocaleTimeString()
		const date = d.toLocaleDateString()
		const getData = await getCustomRepository(ClockinRepository).findOne({
			lineId: clock_in.lineId,
			Date: date,
		})

		console.log('seeee', getData?.userId)

		if (!getData) {
			console.log('success')

			clock_in.Distance = clock_in.distance

			clock_in.Time = time
			clock_in.Date = date

			const result = await getCustomRepository(ClockinRepository).clockin(clock_in)
			// console.log(777, result)
			console.log(time)
			console.log(date)

			return res.status(200).json({
				responseBody: result,
				message: `Success`,
				responseCode: 200,
			})
		} else {
			console.log('fail')
			return res.status(200).json({
				message: `วันนี้คุณได้ทำการ Clock-in ไปแล้วงับๆ`,
				responseCode: 200,
			})
		}
	}
}
export const clockinController = new ClockinController()
