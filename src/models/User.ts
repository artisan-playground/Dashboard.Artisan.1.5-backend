import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Clockin } from './Clock-in'
import { Requests } from './Request'

@Entity({ name: 'user' })
export class User {
	@PrimaryGeneratedColumn({ name: 'userId' })
	public userId: number

	@Column({ name: 'username', type: 'varchar' })
	public username: string
	@Column({ name: 'name', type: 'varchar' })
	public name: string

	@Column({ name: 'UserlineId', type: 'varchar' })
	public UserlineId: string

	@Column({ name: 'Sickleave', type: 'float', default: 3 })
	public Sickleave: number

	@Column({ name: 'Onleave', type: 'float', default: 5 })
	public Onleave: number

	@Column({ name: 'status', type: 'varchar' })
	public status: string

	@OneToMany((_type) => Clockin, (clockin) => clockin.userId)
	public clockin: Clockin[]

	@OneToMany((_type) => Requests, (requests) => requests.requestId)
	public requests: Requests[]
}
