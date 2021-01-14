import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Clockin } from './Clock-in'
import { Requests } from './request'

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

	@OneToMany((_type) => Requests, (requests) => requests.userId)
	public requests: Requests[]
}
