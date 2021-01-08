import { EntityRepository, getCustomRepository, Repository } from 'typeorm'
import { Requests } from '../models/Request'
@EntityRepository(Requests)
export class RequestRepository extends Repository<Requests> {
	public async clockreq(requests: Requests): Promise<Requests | undefined> {
		const dbdata = await getCustomRepository(RequestRepository)
			.createQueryBuilder('request')

			.getMany()


		const result = await getCustomRepository(RequestRepository).save(requests)


		return result
	}
}
