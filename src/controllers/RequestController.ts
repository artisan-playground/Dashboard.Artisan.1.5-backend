import { Advised } from 'aspect.js'
import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { Requests } from '../models/Request'
import { RequestRepository } from '../repository/RequestRepository'

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
			result,
		})
	}
}
export const requestController = new RequestController()
