import { Connection, ConnectionOptions, createConnection, getConnectionOptions } from 'typeorm'

class DBConnection {
	/***
	 *
	 */
	public async initDatabase(): Promise<Connection | void> {
		const options: ConnectionOptions = await getConnectionOptions()
		await createConnection(options)
			.then((connection) => {
				if (connection && connection.isConnected) {
					console.log(`Connection(${connection.name}) success`)
					return connection
				}
			})
			.catch((err) => {
				console.log('failed to create connection')
			})
	}
}
export const dbConnection = new DBConnection()
