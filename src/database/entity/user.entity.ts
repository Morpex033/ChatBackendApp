import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    name: 'email',
    type: 'varchar',
  })
  public email: string;

  @Column({
    name: 'password',
    type: 'varchar',
  })
  public password: string;

  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamp',
    nullable: false,
    generated: true,
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamp',
    nullable: false,
  })
  public updatedAt: Date;

  @OneToOne(() => Account, (account) => account.user, {
    onDelete: 'CASCADE',
  })
  public account: Account;
}
