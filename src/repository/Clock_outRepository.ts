import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { Clockout } from '../models/Clock-out';
@EntityRepository(Clockout)
export class ClockoutRepository extends Repository<Clockout> {
	public async clockout(clockout: Clockout): Promise<Clockout | undefined> {


		const dbdata = await getCustomRepository(ClockoutRepository)
			.createQueryBuilder('clockout')



			.getMany()
			console.log(dbdata);
			// console.log(user.username);



	   if(dbdata.length > 0 ){





		const result = await getCustomRepository(ClockoutRepository).save(clockout)

		console.log('Save Success');


		return result



	   }
	   else{


		const result = await getCustomRepository(ClockoutRepository).save(clockout)

		console.log('Save Success');


		return result


	   }

	}


}
