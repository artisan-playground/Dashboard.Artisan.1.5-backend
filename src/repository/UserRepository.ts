import { EntityRepository, getCustomRepository, Repository } from 'typeorm'
import { User } from '../models/User'
@EntityRepository(User)
export class UserRepository extends Repository<User> {
	public async login(user: User): Promise<User | undefined> {
		const result = await getCustomRepository(UserRepository).save({ UserlineId: user.UserlineId })
		// .createQueryBuilder('user')
		// .where('user.username =:username ', {
		// 	lineId: user.lineId,
		// })

		// .getOne()

		console.log(result)
		return result
	}

	public async creater(user: User): Promise<User | undefined> {
		const dbdata = await getCustomRepository(UserRepository)
			.createQueryBuilder('user')
			.where('user.username =:username', {
				UserlineId: user.UserlineId,
				// password: user.password,
			})
			.getOne()

		console.log(dbdata)
		console.log(user.username)
		return dbdata
	}
	public async updaterr(user: User): Promise<User | undefined> {
		const result = await getCustomRepository(UserRepository)
			.createQueryBuilder('user')
			.where('user.username =:username ', {
				UserlineId: user.UserlineId,
				// username: user.username,
			})
			.getOne()
		return result
	}
	public async delet(user: User): Promise<User | undefined> {
		const dbdatadelete = await getCustomRepository(UserRepository)
			.createQueryBuilder('user')
			.where('user.username =:username', {
				username: user.username,
				// password: user.password,
			})
			.getMany()
		console.log(dbdatadelete)

		if (dbdatadelete.length > 0) {
			const result = await getCustomRepository(UserRepository).remove(user)

			return result
		} else {
			const result: any = {
				message: `ไม่มีข้อมูล`,
				responseCode: 200,
			}
			return result
		}
	}
}
