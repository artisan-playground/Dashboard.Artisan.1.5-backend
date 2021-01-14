import { Advised } from 'aspect.js'
import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { Clockin } from '../models/Clock-in'
import { ClockinRepository } from '../repository/Clock_inRepository'

@Advised()
class ClockinController {
	public async creatCI(req: Request, res: Response): Promise<Response> {
		const clock_in: Clockin = req.body

		clock_in.lineId = req.body.id
		clock_in.Clockin_status = req.body.statusClockin
		clock_in.Clockin_history = req.body.clockinHistory
		clock_in.TimeLate = req.body.timeLate
		const d = new Date()
		const time = d.toLocaleTimeString()
		const date = d.toLocaleDateString()
		const getData = await getCustomRepository(ClockinRepository).findOne({
			lineId: clock_in.lineId,
			Date: date,
		})

		if (!getData) {
			clock_in.Distance = req.body.distance

			clock_in.Time = time
			clock_in.Date = date

			const result = await getCustomRepository(ClockinRepository).clockin(clock_in)

			return res.status(200).json({
				responseBody: result,
				message: `Success`,
				responseCode: 200,
			})
		} else {
			return res.status(200).json({
				message: `วันนี้คุณได้ทำการ Clock-in ไปแล้วงับๆ`,
				responseCode: 200,
			})
		}
	}
}
export const clockinController = new ClockinController()
