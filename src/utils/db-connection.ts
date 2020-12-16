import {
  getConnectionOptions,
  createConnection,
  ConnectionOptions,
  Connection,
} from 'typeorm'

class DBConnection {
  /***
   *
   */
  public async initDatabase(): Promise<Connection | void> {
    console.log('init DB called')
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
        console.log(err)
      })
  }
}
export const dbConnection = new DBConnection()
