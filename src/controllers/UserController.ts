import { Advised } from 'aspect.js'
import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { User } from '../models/User'
import { UserRepository } from '../repository/UserRepository'

@Advised()
class UserController {
	public async login(req: Request, res: Response): Promise<Response> {
		const user: User = req.body
		// console.log('555 = ',user)
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
		user.status = 1
		// user.UserlineId = 'U3ef5f557fecc78c5af1f95a703865b8b'
		const result = await getCustomRepository(UserRepository).creater(user)
		if (result) {
			return res.status(200).json({
				responseBody: result,
				message: `send Email success`,
				responseCode: 200,
			})
		} else {
			return res.status(200).json({
				responseBody: result,
				message: `send Email fail`,
				responseCode: 401,
			})
		}
	}
	public async ChackUser(req: Request, res: Response): Promise<Response> {
		const user: User = req.body
		user.status = 1

		// user.UserlineId = 'U3ef5f557fecc78c5af1f95a703865b8b'
		const getemail = await getCustomRepository(UserRepository).findOne({ username: user.username })
		console.log('User input', user)
		console.log('data base', getemail)

		if (getemail) {
			;('use strict')
			const nodemailer = require('nodemailer')
			const linerich = 'https://line.me/R/ti/p/%40886oreka'
			const email = user.username

			async function main() {
				// สร้างออปเจ็ค transporter เพื่อกำหนดการเชื่อมต่อ SMTP และใช้ตอนส่งเมล
				let transporter = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					port: 587,
					secure: false, // true for 465, false for other ports
					auth: {
						// ข้อมูลการเข้าสู่ระบบ
						user: 'bas6033@gmail.com', // email user ของเรา
						pass: 'bas079354847',
					},
				})
				// เริ่มทำการส่งอีเมล
				// thitiporn8645@gmail.com
				let info = await transporter.sendMail({
					from: '"Artisan Dashboard"<bas6033@gmail.com>', // อีเมลผู้ส่ง
					to: email, // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
					subject: 'ยืนยัน  Email', // หัวข้ออีเมล
					html: `<p>เรียนผู้ใช้ ${email} <br><br> <span>ไปที่ลิ้งค์นี้ยืนยันอีเมลของคุณ</span> <br><a href="https://line.me/R/ti/p/%40886oreka">คลิกที่นี่</a><br><br> <span>ขอบคุณค่ะ</span><br><span>ผู้ดูแลระบบ Artisan Dashboard</span></p>`, // plain text body
				})
				// log ข้อมูลการส่งว่าส่งได้-ไม่ได้
				console.log('Message sent: %s', info.messageId)
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
			console.log('ไม่อีเมล')

			return res.status(200).json({
				responseBody: getemail,
				message: `send Email fail`,
				responseCode: 401,
			})
		}

		// if (result) {
		// 	return res.status(200).json({
		// 		responseBody: result,
		// 		message: `send Email success`,
		// 		responseCode: 200,
		// 	})
		// } else {
		// 	return res.status(200).json({
		// 		responseBody: result,
		// 		message: `send Email fail`,
		// 		responseCode: 401,
		// 	})
		// }
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
