import { EntityRepository, getCustomRepository, Repository } from 'typeorm'
import { User } from '../models/User'
@EntityRepository(User)
export class UserRepository extends Repository<User> {
	public async login(user: User): Promise<User | undefined> {
		const result = await getCustomRepository(UserRepository).save({ UserlineId: user.UserlineId })

	
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


		return dbdata
	}
	public async getlineId(user: User): Promise<User | undefined> {
		const result = await getCustomRepository(UserRepository)
			.createQueryBuilder('user')
			.where('UserlineId: user.UserlineId ', {
				// UserlineId: user.UserlineId,
				// username: user.username,
			})
			.getOne()
		return result
	}
}
