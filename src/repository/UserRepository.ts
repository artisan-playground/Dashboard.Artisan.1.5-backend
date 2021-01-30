import { EntityRepository, getCustomRepository, Repository } from 'typeorm'
import { User } from '../models/User'
@EntityRepository(User)
export class UserRepository extends Repository<User> {
	public async login(user: User): Promise<User | undefined> {
		const result = await getCustomRepository(UserRepository).save({ UserlineId: user.UserlineId })

		return result
	}

	public async Edit(userid: string, remain: number) {
		const Editresult = await getCustomRepository(UserRepository).update(userid, {
			Sickleave: remain,
		})

		return Editresult
	}

	public async getlineId(user: User): Promise<User | undefined> {
		const result = await getCustomRepository(UserRepository)
			.createQueryBuilder('user')
			.where('UserlineId: user.UserlineId ', {})
			.getOne()

		return result
	}
	public async getdataRequset(user: User): Promise<User | undefined> {
		const status = user.status

		if (status === 'LeavesOther') {
			const result = await getCustomRepository(UserRepository)
				.createQueryBuilder('user')
				.where('user.username=:username', {
					username: user.username,
				})
				.getOne()
			return result
		} else {
			const result = await getCustomRepository(UserRepository)
				.createQueryBuilder('user')
				.where('user.UserlineId=:UserlineId', {
					UserlineId: user.UserlineId,
				})
				.getOne()
			return result
		}
	}
}
