import { Advised } from 'aspect.js'
import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { Clockin } from '../models/Clock-in'
import { ClockinRepository } from '../repository/Clock_inRepository'


@Advised()
class ClockinController {


	public async creatCI(req: Request, res: Response): Promise<Response> {
		const clock_in: Clockin = req.body
		console.log("555",req.body);
		console.log("666",clock_in);


		const d = new Date();
		const time = d.toLocaleTimeString();
		const date = d.toLocaleDateString();


		clock_in.Time = time;
		clock_in.Date = date;



		const result = await getCustomRepository(ClockinRepository).clockout(clock_in)
		console.log(777,result);
		console.log(time);
		console.log(date);

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
