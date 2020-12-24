import dotenv from 'dotenv'
dotenv.config()

type Config = {
	PORT: string | number
	PROCESSING_FILE_TIMEOUT: number | undefined
	CHUNK_SIZE: number
	AUTH_LINEBOT_GDAY: string | undefined
	LINE_PUSH_MESSAGE_ENDPOINT: string
	LINE_REPLY_MESSAGE_ENDPOINT: string
}

const configs: Config = {
	PORT: process.env.PORT || 8100,
	PROCESSING_FILE_TIMEOUT: 60000,
	CHUNK_SIZE: 10,
	AUTH_LINEBOT_GDAY: process.env.AUTH_LINEBOT_GDAY,
	LINE_PUSH_MESSAGE_ENDPOINT:
		process.env.LINE_PUSH_MESSAGE_ENDPOINT || 'https://api.line.me/v2/bot/message/push',
	LINE_REPLY_MESSAGE_ENDPOINT:
		process.env.LINE_REPLY_MESSAGE_ENDPOINT || 'https://api.line.me/v2/bot/message/reply',
}
console.log(configs)

export default configs
