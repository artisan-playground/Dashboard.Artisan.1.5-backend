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

	public async Adminadd(requests: any) {
		const dbdata = await getCustomRepository(RequestRepository)
			.createQueryBuilder('request')

			.getMany()

		const result = await getCustomRepository(RequestRepository).save(requests)

		return result
	}

	public async getdataRequset(requests: Requests): Promise<Requests | undefined> {
		const sickleave = await getCustomRepository(RequestRepository)
			.createQueryBuilder('request')
			.where('request.lineId =:lineId and request.Leavetype =:Leavetype', {
				lineId: requests.lineId,
				Leavetype: 'ลาป่วย',
			})
			.getMany()

		const onLeave = await getCustomRepository(RequestRepository)
			.createQueryBuilder('request')
			.where('request.lineId =:lineId and request.Leavetype =:Leavetype', {
				lineId: requests.lineId,
				Leavetype: 'ลากิจ',
			})
			.getMany()

		const result: any = {
			sick: sickleave,
			onleave: onLeave,
		}

		return result
	}
}
