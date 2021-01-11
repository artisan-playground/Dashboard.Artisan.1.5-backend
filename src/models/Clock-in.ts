import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'
@Entity({ name: 'clock-in' })
export class Clockin {
	@PrimaryGeneratedColumn({ name: 'clockinId' })
	public clockinId: number

	@Column({ name: 'lineId', type: 'varchar' })
	public lineId: string

	@Column({ name: 'Distance', type: 'varchar' })
	public Distance: string

	@Column({ name: 'Time', type: 'varchar' })
	public Time: string

	@Column({ name: 'Date', type: 'varchar' })
	public Date: string
	UserlineId: any


	@Index()
	@ManyToOne((_type) => User, (userId) => userId.clockin, {})
	@JoinColumn({ name: 'IDuserclockin' })
	public userId: User
}
