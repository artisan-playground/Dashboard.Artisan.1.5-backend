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
route.post('/requestNotify', replybot.RequestNotify)
route.post('/checkuser', userController.ChackUser)
route.post('/getrequest', requestController.gatdataRequset)
route.post('/clockout', clockoutController.creatCO)
route.post('/request', requestController.creatReq)
route.post('/clockin', clockinController.creatCI)

export default route
