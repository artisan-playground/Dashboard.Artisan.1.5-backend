import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'request' })
export class Requests {
	@PrimaryGeneratedColumn({ name: 'requestId' })
	public userId: number

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

	@Column({ name: 'Leaveevent', type: 'text' })
	public Leaveevent: string

	// @Column({ name: 'admin', type: 'varchar' })
	// public admin: string

	// @Column({ name: 'Document', type: 'image' })
	// public Document: Image

	// @Column({ name: 'Date', type: 'varchar' })
	// public Date: string
}
