import dotenv from 'dotenv';
dotenv.config()

type Config = {
	PORT: string | number
	PROCESSING_FILE_TIMEOUT: number | undefined
	CHUNK_SIZE: number
}

const configs: Config = {
	PORT: process.env.PORT || 8100,
	PROCESSING_FILE_TIMEOUT: 60000,
	CHUNK_SIZE: 10,
}
console.log(configs);

export default configs
