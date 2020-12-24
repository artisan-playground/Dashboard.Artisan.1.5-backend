import { Router } from 'express'
import { clockinController } from '../controllers/Clock_inComtroller'
import { clockoutController } from '../controllers/Clock_outController'
import { companyController } from '../controllers/CompanyController'
import { requestController } from '../controllers/RequestController'
import { userController } from '../controllers/UserController'
import { gDayBot } from '../utils/g-day-bot'

const route = Router()

route.post('/gday-webhook', gDayBot.listenerWebHook.bind(gDayBot))

route.post('/checkuser', userController.ChackUser)
route.post('/login', userController.login)
route.post('/create', userController.creater)
route.put('/update', userController.updater)
route.post('/delete', userController.deleter)
route.post('/company', companyController.companyUser)
route.post('/clockout', clockoutController.creatCO)
route.post('/request', requestController.creatReq)
route.post('/clockin', clockinController.creatCI)

export default route
