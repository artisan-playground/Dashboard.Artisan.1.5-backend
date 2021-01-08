import { Router } from 'express'
import { clockinController } from '../controllers/Clock_inComtroller'
import { clockoutController } from '../controllers/Clock_outController'
import { requestController } from '../controllers/RequestController'
import { userController } from '../controllers/UserController'
import { gDayBot } from '../utils/g-day-bot'
const route = Router()
route.post('/gday-webhook', gDayBot.listenerWebHook.bind(gDayBot))
route.post('/checkuser', userController.ChackUser)

route.post('/clockout', clockoutController.creatCO)
route.post('/request', requestController.creatReq)
route.post('/clockin', clockinController.creatCI)

export default route
