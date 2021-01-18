import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

@Entity({ name: 'request' })
export class Requests {
	@PrimaryGeneratedColumn({ name: 'requestId' })
	public requestId: number

	@Column({ name: 'lineId', type: 'varchar' })
	public lineId: string

	@Column({ name: 'Leavetype', type: 'varchar' })
	public Leavetype: string

	@Column({ name: 'Timeperiod', type: 'varchar' })
	public Timeperiod: string

	@Column({ name: 'Since', type: 'varchar' })
	public Since: string

	@Column({ name: 'Until', type: 'varchar' })
	public Until: string

	@Column({ name: 'CountLeave', type: 'numeric' })
	public CountLeave: number

	@Column({ name: 'Leaveevent', type: 'text' })
	public Leaveevent: string

	@Index()
	@ManyToOne((_type) => User, (userId) => userId.requests, {})
	@JoinColumn({ name: 'IDuserrequest' })
	public userId: User
}
