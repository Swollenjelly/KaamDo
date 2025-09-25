import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type UserRole = 'customer' | 'vendor' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'varchar', default: 'customer' })
  role!: UserRole;
}
