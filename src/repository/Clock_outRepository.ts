import { EntityRepository, getCustomRepository, Repository } from 'typeorm'
import { Clockout } from '../models/Clock-out'
@EntityRepository(Clockout)
export class ClockoutRepository extends Repository<Clockout> {
	public async clockout(clockout: Clockout): Promise<Clockout | undefined> {
		const dbdata = await getCustomRepository(ClockoutRepository)
			.createQueryBuilder('clockout')

			.getMany()

		const result = await getCustomRepository(ClockoutRepository).save(clockout)


		return result
	}
}
