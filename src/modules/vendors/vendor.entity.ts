import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('vendor_profiles')
export class VendorProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  userId!: string; // references users.id

  @Column({ nullable: true })
  companyName?: string;

  @Column({ nullable: true })
  tradeCategories?: string; // e.g., "plumbing,electrical"
}
