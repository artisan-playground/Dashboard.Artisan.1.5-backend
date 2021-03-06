import { Router } from 'express'
import { clockinController } from '../controllers/Clock_inComtroller'
import { clockoutController } from '../controllers/Clock_outController'
import { requestController } from '../controllers/RequestController'
import { userController } from '../controllers/UserController'
import { gDayBot } from '../utils/g-day-bot'
import { replybot } from '../utils/g-day-pushmassage'

const route = Router()
route.post('/gday-webhook', gDayBot.listenerWebHook.bind(gDayBot))
route.post('/sendmassage', replybot.Sendmassage)
// route.post('/requestNotify', replybot.RequestNotify)
route.post('/checkuser', userController.ChackUser)
route.post('/getrequest', userController.gatdataRequset)
route.post('/getEvents', requestController.getEvents)
route.post('/createEvents', requestController.createEvents)
route.post('/clockout', clockoutController.creatCO)
route.post('/Userrequest', requestController.UserReq)
route.post('/Adminrequest', requestController.AdminReq)
route.post('/clockin', clockinController.creatCI)

export default route
