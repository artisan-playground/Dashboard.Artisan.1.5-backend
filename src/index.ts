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
				)
				Sentry.init({
					dsn: 'https://4b4b0af4328d4f399dfd02de5e74a5ab@o390647.ingest.sentry.io/5235389',
				})

				app.use(Sentry.Handlers.requestHandler())
				app.use(Sentry.Handlers.errorHandler())
				app.use(cors())
				app.use('/api', routes)


				app.get('/', (req: Request, res: Response) => {

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

				})
				return app
			}
		} catch (error) {

		}
	}
}
export const app = new ClarisApp().init()
