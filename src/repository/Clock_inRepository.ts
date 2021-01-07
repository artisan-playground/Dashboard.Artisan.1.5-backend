import { EntityRepository, getCustomRepository, Repository } from 'typeorm'
import { Clockin } from '../models/Clock-in'
@EntityRepository(Clockin)
export class ClockinRepository extends Repository<Clockin> {
	public async clockin(clockin: Clockin): Promise<Clockin | undefined> {
		const dbdata = await getCustomRepository(ClockinRepository)
			.createQueryBuilder('clockin')

			.getMany()
		// console.log(dbdata)
		// console.log(user.username)

		const result = await getCustomRepository(ClockinRepository).save(clockin)

		console.log('Save Success')
		return result
	}
}
