import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Clockin } from './Clock-in'
// import { Company } from './Company'
@Entity({ name: 'user' })
export class User {
	@PrimaryGeneratedColumn({ name: 'userId' })
	public userId: number

	@Column({ name: 'username', type: 'varchar' })
	public username: string

	@Column({ name: 'UserlineId', type: 'varchar' })
	public UserlineId: string

	@Column({ name: 'status', type: 'int' })
	public status: number

	@OneToMany((_type) => Clockin, (clockin) => clockin.userId)
	public clockin: Clockin[]

	// @Index()
	// @ManyToOne((_type) => Company, (companyId) => companyId.user, {
	// 	nullable: true,
	// })
	// @JoinColumn({ name: 'companyId' })
	// public companyId: Company
}
