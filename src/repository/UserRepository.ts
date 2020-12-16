import { EntityRepository, getCustomRepository, Repository } from 'typeorm'
import { User } from '../models/User'
@EntityRepository(User)
export class UserRepository extends Repository<User> {
	public async login(user: User): Promise<User | undefined> {
		const result = await getCustomRepository(UserRepository)
			.createQueryBuilder('user')
			.where('user.username =:username and user.password =:password', {
				username: user.username,
				password: user.password,
			})
			.getOne()
		console.log(result)
		return result
	}
	public async creater(user: User): Promise<User | undefined> {


		const dbdata = await getCustomRepository(UserRepository)
			.createQueryBuilder('user')
			.where('user.username =:username', {
				username: user.username,
				// password: user.password,

			})
			.getMany()
			console.log(dbdata);
			console.log(user.username);


	   if(dbdata.length > 0 ){
		'use strict';
		const nodemailer = require('nodemailer');
		const linerich = 'https://line.me/R/ti/p/%40886oreka'
		const email = user.username

		async function main() {
		// สร้างออปเจ็ค transporter เพื่อกำหนดการเชื่อมต่อ SMTP และใช้ตอนส่งเมล
		let transporter = nodemailer.createTransport({
		 host: 'smtp.gmail.com',
		 port: 587,
		 secure: false, // true for 465, false for other ports
		 auth: { // ข้อมูลการเข้าสู่ระบบ
		   user: 'bas6033@gmail.com', // email user ของเรา
		   pass: 'bas079354847'
		 }
		});
		// เริ่มทำการส่งอีเมล
		// thitiporn8645@gmail.com
		let info = await transporter.sendMail({
		from: '"Artisan Dashboard"<bas6033@gmail.com>', // อีเมลผู้ส่ง
		to: email, // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
		subject: 'ยืนยัน  Email', // หัวข้ออีเมล
		html:  `<p>เรียนผู้ใช้ ${email} <br><br> <span>ไปที่ลิ้งค์นี้ยืนยันอีเมลของคุณ</span> <br><a href="https://line.me/R/ti/p/%40886oreka">คลิกที่นี่</a><br><br> <span>ขอบคุณค่ะ</span><br><span>ผู้ดูแลระบบ Artisan Dashboard</span></p>`, // plain text body
		// html: '<b>Hello world?</b>' // html body
		});
		// log ข้อมูลการส่งว่าส่งได้-ไม่ได้
		console.log('Message sent: %s', info.messageId);
		}
		main().catch(console.error);


		 const result : any ={
			// message: `ซ้ำ`,
			message: `ส่งอีเมลสำเร็จ`,
		 	responseCode: 200,


		}

	    return result



	   }
	   else{
		const result = await getCustomRepository(UserRepository).save(user)

		return result

	   }

	}
	public async updaterr(user: User): Promise<User | undefined> {
		const result = await getCustomRepository(UserRepository).save(user)
			// .createQueryBuilder('user')
			// // .where('user.username =:username and user.password =:password', {
			// // 	username: user.username,
			// // 	password: user.password,
			// // })
			// .getOne()
		return result
	}
	public async delet(user: User): Promise<User | undefined> {

		const dbdatadelete = await getCustomRepository(UserRepository)
			.createQueryBuilder('user')
			.where('user.username =:username', {
				username: user.username,
				// password: user.password,

			})
			.getMany()
			console.log(dbdatadelete);


	   if(dbdatadelete.length > 0 ){
		const result = await getCustomRepository(UserRepository).remove(user)

		return result






	   }
	   else{
		const result : any ={
			message: `ไม่มีข้อมูล`,
			responseCode: 200,


		}
		return result

	   }

	}
}
