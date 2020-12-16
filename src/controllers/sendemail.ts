'use strict';
const nodemailer = require('nodemailer');

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
from: '"test"<thitiporn8645@gmail.com>', // อีเมลผู้ส่ง
to: '@gmail.com', // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
subject: 'TestSend Email✔', // หัวข้ออีเมล
text: 'ลองส่งเฉยๆ?', // plain text body
// html: '<b>Hello world?</b>' // html body
});
// log ข้อมูลการส่งว่าส่งได้-ไม่ได้
console.log('Message sent: %s', info.messageId);
}
main().catch(console.error);
