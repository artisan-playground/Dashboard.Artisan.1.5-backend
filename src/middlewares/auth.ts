import { NextFunction, Request, Response } from 'express'

const authorize = async (req: Request, res: Response, next: NextFunction) => {
	return next()
}

export default authorize
