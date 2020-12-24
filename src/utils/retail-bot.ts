// import { Request, Response } from 'express'
// import request from 'request'
// import { getCustomRepository } from 'typeorm'
// import { UserRepository } from '../repository/UserRepository'
// import config from './../configs/config'
// import { tokenManagement } from './token-management'

// class RetailBot {
//   public TokenRtAccess = config.AUTH_LINEBOT_RT

//   public async listenerWebHook(req: Request, res: Response) {
//     let link = ''
//     const reply_token: string = req.body.events[0].replyToken
//     const reply_text: string = req.body.events[0].message.text
//     const userId = req.body.events[0].source.userId
//     console.log('User ID  : ', req.body.events[0].source.userId)
//     console.log('Request Event  : ', req.body.events[0])
//     console.log('message : ', reply_text)
//     const hasLineUserId = await getCustomRepository(UserRepository).findUserByLineUserId(userId)
//     if (!hasLineUserId.length) {
//       link = `${config.LINE_FRONTEND_ENDPOINT}/register-retail?id=${userId}&mode=retail&path=`
//       console.log('NOT REGISTER', link)
//     } else {
//       link = `${config.LINE_FRONTEND_ENDPOINT}/`
//       console.log('REGISTERED', link)
//     }

//     if (!hasLineUserId.length) {
//       this.registerResponse(reply_token, link, userId)
//     } else {
//       if (reply_text == 'สั่งปกติ') {
//         this.retailResponse(reply_token, link, userId)
//         console.log('retailResponse', link)
//       } else if (reply_text == 'สั่งด่วน') {
//         this.retailQuickSaleResponse(reply_token, link, userId)
//       } else {
//         this.wrongReply(reply_token, link)
//       }
//     }

//     return res.status(200).json({})
//   }

//   public registerResponse(reply_token: string, link: string, userId: string) {
//     let headers_rt = {
//       'Content-Type': 'application/json',
//       Authorization: this.TokenRtAccess,
//     }
//     let body_rt = JSON.stringify({
//       replyToken: reply_token,
//       to: userId,
//       messages: [
//         {
//           type: 'template',
//           altText: 'ลงทะเบียนสมาชิก',
//           template: {
//             backgroundColor: '#000',
//             type: 'buttons',
//             title: 'กรุณาลงทะเบียน',
//             text: `กรุณาสมัครสมาชิกก่อนใช้บริการ`,
//             actions: [
//               {
//                 type: 'uri',
//                 label: 'สมัครสมาชิก',
//                 uri: link,
//               },
//             ],
//           },
//         },
//       ],
//     })
//     request.post(
//       {
//         url: config.LINE_PUSH_MESSAGE_ENDPOINT,
//         headers: headers_rt,
//         body: body_rt,
//       },
//       (err: any, res: any, body: any) => {
//         console.log('status = ' + res.statusCode)
//       }
//     )
//   }

//   public async retailResponse(reply_token: string, link: string, userId: string) {
//     console.log('LINK', link)
//     console.log('USER ID', userId)
//     let headers_rt = {
//       'Content-Type': 'application/json',
//       Authorization: this.TokenRtAccess,
//     }
//     const token = await tokenManagement.generateToken(userId)
//     let body_rt = JSON.stringify({
//       replyToken: reply_token,
//       to: userId,
//       messages: [
//         {
//           type: 'imagemap',
//           baseUrl: 'https://claris-static.artisandigital.tech/imagemap/retail_images',
//           altText: 'เมนูจัดการคำสั่งซื้อ',
//           baseSize: {
//             width: 1040,
//             height: 1040,
//           },
//           actions: [
//             {
//               type: 'uri',
//               area: {
//                 x: 500,
//                 y: 11,
//                 width: 535,
//                 height: 317,
//               },
//               linkUri: link + `history-order?id=${userId}&mode=retail&token=${token}`,
//             },
//             {
//               type: 'uri',
//               area: {
//                 x: 490,
//                 y: 337,
//                 width: 530,
//                 height: 340,
//               },
//               linkUri:
//                 link +
//                 `list-product?id=${userId}&mode=retail&orderType=regular&firstTime=1&token=${token}`,
//             },
//             {
//               type: 'uri',
//               area: {
//                 x: 0,
//                 y: 348,
//                 width: 508,
//                 height: 360,
//               },
//               linkUri:
//                 link +
//                 `favorite?id=${userId}&mode=retail&token=${token}&orderType=regular&firstTime=1`,
//             },
//           ],
//         },
//       ],
//     })
//     console.log('response reply BODY', body_rt)
//     request.post(
//       {
//         url: config.LINE_PUSH_MESSAGE_ENDPOINT,
//         headers: headers_rt,
//         body: body_rt,
//       },
//       (err: any, res: any, body: any) => {
//         console.log('status = ' + res.statusCode)
//       }
//     )
//   }
//   public wrongReply(reply_token: string, userId: string) {
//     let headers = {
//       'Content-Type': 'application/json',
//       Authorization: this.TokenRtAccess,
//     }
//     let body = JSON.stringify({
//       replyToken: reply_token,
//       to: userId,
//       messages: [
//         {
//           type: 'text',
//           text: 'ขออภัย กรุณาพิมพ์ใหม่',
//         },
//       ],
//     })
//     console.log('wrong reply BODY', body)
//     request.post(
//       {
//         url: config.LINE_REPLY_MESSAGE_ENDPOINT,
//         headers: headers,
//         body: body,
//       },
//       (err: any, res: any, body: any) => {
//         console.log('status = ' + res.statusCode)
//       }
//     )
//   }

//   public async retailQuickSaleResponse(reply_token: string, link: string, userId: string) {
//     let headers_rt = {
//       'Content-Type': 'application/json',
//       Authorization: this.TokenRtAccess,
//     }
//     const token = await tokenManagement.generateToken(userId)
//     let body_rt = JSON.stringify({
//       replyToken: reply_token,
//       to: userId,
//       messages: [
//         {
//           type: 'imagemap',
//           baseUrl: 'https://claris-static.artisandigital.tech/imagemap/retail_images',
//           altText: 'เมนูจัดการคำสั่งซื้อ',
//           baseSize: {
//             width: 1040,
//             height: 1040,
//           },
//           actions: [
//             {
//               type: 'uri',
//               area: {
//                 x: 500,
//                 y: 11,
//                 width: 535,
//                 height: 317,
//               },
//               linkUri: link + `history-order?id=${userId}&mode=retail&token=${token}`,
//             },
//             {
//               type: 'uri',
//               area: {
//                 x: 490,
//                 y: 337,
//                 width: 530,
//                 height: 340,
//               },
//               linkUri:
//                 link +
//                 `list-product?id=${userId}&mode=retail&orderType=onDemand&firstTime=1&token=${token}`,
//             },
//             {
//               type: 'uri',
//               area: {
//                 x: 0,
//                 y: 348,
//                 width: 508,
//                 height: 360,
//               },
//               linkUri:
//                 link +
//                 `favorite?id=${userId}&mode=retail&token=${token}&orderType=onDemand&firstTime=1`,
//             },
//           ],
//         },
//       ],
//     })
//     request.post(
//       {
//         url: config.LINE_PUSH_MESSAGE_ENDPOINT,
//         headers: headers_rt,
//         body: body_rt,
//       },
//       (err: any, res: any, body: any) => {
//         console.log('status = ' + res.statusCode)
//       }
//     )
//   }
// }

// export const retailResponse = new RetailBot()
