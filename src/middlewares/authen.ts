import { NextFunction, Request, Response } from 'express'

const pathWithOutAuthen = ['/login']

const authen = (req: Request, res: Response, next: NextFunction) => {
	for (const item of pathWithOutAuthen) {
		if (req.path.includes(item)) {
			return next()
		}
	}

	if (!req.headers.authorization) {
		return res.status(401).json({
			success: false,
			message: 'Unauthorization',
		})
	}
	// send Decode with header
	// req.body.user = decode
	return next()
}

export = authen
