import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    name: 'title',
    type: 'varchar',
    nullable: false,
  })
  public title: string;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
  })
  public description: string;

  @Column({
    name: 'isPublic',
    type: 'boolean',
    default: true,
  })
  public isPublic: boolean;

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

  @ManyToOne(() => Account, (account) => account.chatsOwned, {
    onDelete: 'CASCADE',
  })
  public owner: Account;

  @ManyToMany(() => Account, (account) => account.chats)
  @JoinTable({ name: 'account_chat' })
  public accounts: Account[];
}
