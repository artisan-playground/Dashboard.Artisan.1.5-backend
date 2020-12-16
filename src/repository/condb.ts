// import dotenv from 'dotenv'
// dotenv.config()

const { Pool, Client } = require('pg')

// const configs = {
// 	PORT: process.env.POSTGRES_PWD
	
// }

const client = new Client ({
  connectionString:'postgresql://postgres:artisanadmin@34.87.84.114:5432/dashboard'
})

//  console.log(configs.PORT);
 
export default client
 
     





