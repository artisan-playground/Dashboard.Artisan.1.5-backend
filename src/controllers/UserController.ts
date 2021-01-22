import { Advised } from 'aspect.js'
import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { User } from '../models/User'
import { UserRepository } from '../repository/UserRepository'

@Advised()
class UserController {
	public async ChackUser(req: Request, res: Response): Promise<Response> {
		const user: User = req.body

		const getemail = await getCustomRepository(UserRepository).findOne({ username: user.username })

		if (getemail) {
			;('use strict')
			const nodemailer = require('nodemailer')
			const linerich = 'https://line.me/R/ti/p/%40886oreka'
			const email = user.username

			async function main() {
				let transporter = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					port: 587,
					secure: false,
					auth: {
						user: 'bas6033@gmail.com',
						pass: 'bas079354847',
					},
				})

				let info = await transporter.sendMail({
					from: '"Artisan Dashboard"<bas6033@gmail.com>',
					to: email,
					subject: 'ยืนยัน  Email',
					html: `<p>เรียนผู้ใช้ ${email} <br><br> <span>ไปที่ลิ้งค์นี้ยืนยันอีเมลของคุณ</span> <br><a href="https://line.me/R/ti/p/%40886oreka">คลิกที่นี่</a><br><br> <span>ขอบคุณค่ะ</span><br><span>ผู้ดูแลระบบ Artisan Dashboard</span></p>`,
				})
			}
			main().catch(console.error)

			const result = await getCustomRepository(UserRepository).update(getemail.userId, {
				UserlineId: user.UserlineId,
			})

			return res.status(200).json({
				responseBody: result,
				message: `Success`,
				responseCode: 200,
			})
		} else {
			return res.status(200).json({
				responseBody: getemail,
				message: `send Email fail`,
				responseCode: 401,
			})
		}
	}
	public async gatdataRequset(req: Request, res: Response): Promise<Response> {
		const user: User = req.body
		const result = await getCustomRepository(UserRepository).getdataRequset(user)

		return res.status(200).json({
			responseBody: result,
			responseCode: 200,
		})
	}
}

export const userController = new UserController()
