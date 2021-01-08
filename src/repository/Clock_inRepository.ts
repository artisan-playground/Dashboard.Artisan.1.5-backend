import { EntityRepository, getCustomRepository, Repository } from 'typeorm'
import { Clockin } from '../models/Clock-in'
@EntityRepository(Clockin)
export class ClockinRepository extends Repository<Clockin> {
	public async clockin(clockin: Clockin): Promise<Clockin | undefined> {
		const dbdata = await getCustomRepository(ClockinRepository)
			.createQueryBuilder('clockin')

			.getMany()
	

		const result = await getCustomRepository(ClockinRepository).save(clockin)

		return result
	}
}
