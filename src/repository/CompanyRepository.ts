
import { EntityRepository, getCustomRepository, Repository } from 'typeorm'
import { Company } from '../models/Company'
import { User } from '../models/User'

@EntityRepository(User)
export class CompanyRepository extends Repository<User> {
	public async companyuser(user: User, company: Company): Promise<User[] | undefined> {
		const result = await getCustomRepository(CompanyRepository)
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.companyId', 'company')
			.where('company.companyId =:companyId', {
				companyId: 1,
			})
			.getMany()

		return result
	}
}
