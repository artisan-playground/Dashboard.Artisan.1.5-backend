import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

@Entity({ name: 'company' })
export class Company {
	@PrimaryGeneratedColumn({ name: 'companyId' })
	public companyId: number

	@Column({ name: 'companyName', type: 'varchar' })
	public companyName: string

	@OneToMany((_type) => User, (user) => user.companyId)
	public user: User[]
}
