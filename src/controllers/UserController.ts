import { Advised } from 'aspect.js'
import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { User } from '../models/User'
import { UserRepository } from '../repository/UserRepository'

@Advised()
class UserController {
	public async login(req: Request, res: Response): Promise<Response> {
		const user: User = req.body
        console.log(req.body)
		const result = await getCustomRepository(UserRepository).login(user)
		if (result) {
			return res.status(200).json({
				responseBody: result,
				message: `login success`,
				responseCode: 200,
			})
		} else {
			return res.status(200).json({
				responseBody: result,
				message: `login fail`,
				responseCode: 401,
			})
		}
	}

	public async creater(req: Request, res: Response): Promise<Response> {
		const user: User = req.body
        user.status=1
		const result = await getCustomRepository(UserRepository).creater(user)
		return res.status(200).json(result)

	}
	public async updater(req: Request, res: Response): Promise<Response> {
		const user: User = req.body

		const result = await getCustomRepository(UserRepository).updaterr(user)
		return res.status(200).json(result)


	}
	public async deleter(req: Request, res: Response): Promise<Response> {
		const user: User = req.body

		const result = await getCustomRepository(UserRepository).delet(user)
		return res.status(200).json(result)

	}
}

export const userController = new UserController()
