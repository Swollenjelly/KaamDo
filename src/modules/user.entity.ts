import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type UserRole = 'customer' | 'vendor' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  phone!: string;              // required + unique

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email?: string;              // optional + unique

  @Column()
  name!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'varchar', default: 'customer' })
  role!: UserRole;
}
