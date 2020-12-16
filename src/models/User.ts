import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Company } from './Company'

@Entity({ name: 'user' })
export class User {
	@PrimaryGeneratedColumn({ name: 'userId' })
	public userId: number

	@Column({ name: 'username', type: 'varchar' })
	public username: string

	@Column({ name: 'password', type: 'varchar' })
	public password: string

	@Column({ name: 'status', type: 'int' })
	public status: number

	@Index()
	@ManyToOne((_type) => Company, (companyId) => companyId.user, {
		nullable: true,
	})
	@JoinColumn({ name: 'companyId' })
	public companyId: Company
}
