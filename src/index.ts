import * as Sentry from '@sentry/node'
import bodyParser from 'body-parser'
import cors from 'cors'
import express, { Request, Response } from 'express'
import fileUpload from 'express-fileupload'
import morgan from 'morgan'
import path from 'path'
import 'reflect-metadata'
import { getConnection } from 'typeorm'
import config from './configs/config'
import routes from './routes/api'
import { dbConnection } from './utils/db-connection'

class ClarisApp {
	public async init() {
		const app = express()
		console.log('initialize database')
		try {
			await dbConnection.initDatabase()
			const connection = getConnection()
			if (connection && connection.isConnected) {
				const port = config.PORT
				// configure middleware
				app.set('port', port) // set express to use this port
				app.set('views', __dirname + '/views') // set express to look in this folder to render our view
				app.set('view engine', 'ejs') // configure template engine
				app.use(bodyParser.urlencoded({ extended: false }))
				app.use(bodyParser.json()) // parse form data client
				app.use(express.static(path.join(__dirname, 'public'))) // configure express to use public folder
				app.use(morgan('dev'))
				app.use(
					fileUpload({
						useTempFiles: true,
						tempFileDir: path.join(__dirname, 'temp'),
					})
				) // configure fileupload
				Sentry.init({
					dsn: 'https://4b4b0af4328d4f399dfd02de5e74a5ab@o390647.ingest.sentry.io/5235389',
				})
				// The request handler must be the first middleware on the app
				app.use(Sentry.Handlers.requestHandler())
				app.use(Sentry.Handlers.errorHandler())
				app.use(cors())
				app.use('/api', routes)
				// app.post('/api/login', userController.login)
				// app.post('/api/create',userController.creater)
				// app.put('/api/update',userController.updater)
				// app.post('/api/delete',userController.deleter)
				// app.post('/api/company',companyController.companyUser)
				// app.post('/api/clockout',clockoutController.creatCO)
				// app.post('/api/request',requestController.creatReq)
				// app.post('/api/clockin',clockinController.creatCI)

				app.get('/', (req: Request, res: Response) => {
					console.log(process.env)
					return res.render('welcome', {
						message: `Welcome to service`,
					})
				})

				app.use((req: Request, res: Response, next: any) => {
					res.header('Access-Control-Allow-Origin', '*')
					res.header(
						'Access-Control-Allow-Headers',
						'Origin, X-Requested-With, Content-Type, Accept'
					)
					next()
				})
				app.listen(port, () => {
					console.log(`Server running on port: ${port}`)
				})
				return app
			}
		} catch (error) {
			console.log('error', error.message)
		}
	}
}
export const app = new ClarisApp().init()
