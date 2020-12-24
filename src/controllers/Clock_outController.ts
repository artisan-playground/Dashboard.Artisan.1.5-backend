import { Advised } from 'aspect.js'
import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { Clockout } from '../models/Clock-out'
import { ClockoutRepository } from '../repository/Clock_outRepository'

@Advised()
class ClockoutController {
	public async creatCO(req: Request, res: Response): Promise<Response> {
		const clock_out: Clockout = req.body
		console.log('555', req.body)
		console.log('666', clock_out)

		clock_out.lineId = 'U3ef5f557fecc78c5af1f95a703865b8b'
		const d = new Date()
		const time = d.toLocaleTimeString()
		const date = d.toLocaleDateString()

		clock_out.Time = time
		clock_out.Date = date

		const result = await getCustomRepository(ClockoutRepository).clockout(clock_out)
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
export const clockoutController = new ClockoutController()
