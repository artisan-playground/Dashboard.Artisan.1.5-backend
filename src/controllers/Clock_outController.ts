import { Advised } from 'aspect.js'
import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { Clockout } from '../models/Clock-out'
import { ClockoutRepository } from '../repository/Clock_outRepository'

@Advised()
class ClockoutController {
	public async creatCO(req: Request, res: Response): Promise<Response> {
		const clock_out: Clockout = req.body
		const id = req.body.lineId
		const today = req.body.Today
		const tomorrow = req.body.Tomorrow
		const issue = req.body.Issue
		const projects = req.body.Projects
		const tasks = req.body.Tasks

		const d = new Date()
		const time = d.toLocaleTimeString()
		const date = d.toLocaleDateString()

		const getData = await getCustomRepository(ClockoutRepository).findOne({
			lineId: id,
			Date: date,
		})

		if (!getData) {
			clock_out.Time = time
			clock_out.Date = date

			const result = await getCustomRepository(ClockoutRepository).clockout(clock_out)

			return res.status(100).json({
				responseBody: result,
				message: `Success`,
				responseCode: 100,
			})
		} else {
			const result = await getCustomRepository(ClockoutRepository).update(getData.userId, {
				lineId: clock_out.lineId,
				Today: clock_out.Today,
				Tomorrow: clock_out.Tomorrow,
				Issue: clock_out.Issue,
				Projects: clock_out.Projects,
				Tasks: clock_out.Tasks,
				Date: date,
				Time: time,
			})

			return res.status(200).json({
				message: `แก้ไขสำเร็จ`,
				responseCode: 200,
			})
		}
	}
}
export const clockoutController = new ClockoutController()
