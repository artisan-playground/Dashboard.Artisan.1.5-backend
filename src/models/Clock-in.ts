import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'


@Entity({ name: 'clock-in' })
export class Clockin {
	@PrimaryGeneratedColumn({ name: 'userId' })
	public userId: number

	@Column({ name: 'lineId', type: 'varchar' })
	public lineId:string


	@Column({ name: 'Distance', type: 'varchar' })
	public Distance: string

	@Column({ name: 'Time', type: 'varchar' })
	public Time: string

	@Column({ name: 'Date', type: 'varchar' })
	public Date: string


	// @Column({ name: 'Projects', type: 'varchar' })
	// public Projects: string


	// @Index()
	// @ManyToOne((_type) => Company, (companyId) => companyId.user, {
	// 	nullable: true,
	// })
	// @JoinColumn({ name: 'companyId' })
	// public companyId: Company
}
