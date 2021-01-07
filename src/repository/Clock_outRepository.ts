import { EntityRepository, getCustomRepository, Repository } from 'typeorm'
import { Clockout } from '../models/Clock-out'
@EntityRepository(Clockout)
export class ClockoutRepository extends Repository<Clockout> {
	public async clockout(clockout: Clockout): Promise<Clockout | undefined> {
		const dbdata = await getCustomRepository(ClockoutRepository)
			.createQueryBuilder('clockout')

			.getMany()
		console.log(dbdata)
		// console.log(user.username);

		const result = await getCustomRepository(ClockoutRepository).save(clockout)

		console.log('Save Success')

		return result
	}

	// public async clockoutupdate(clockout: Clockout): Promise<Clockout | undefined> {
	// 	const dbdata = await getCustomRepository(ClockoutRepository)
	// 		.createQueryBuilder('clockout')

	// 		.getMany()
	// 	console.log(dbdata)
	// 	// console.log(user.username);

	// 	const result = await getCustomRepository(ClockoutRepository).update(clockout)

	// 	console.log('Save Success')

	// 	return result
	// }
}
