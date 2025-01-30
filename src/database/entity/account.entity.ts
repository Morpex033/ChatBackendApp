import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { AccountRole } from '../../user/enum/account-role.enum';
import { Chat } from './chat.entity';

@Entity('accounts')
@Unique(['username'])
export class Account {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    name: 'nickname',
    type: 'varchar',
    nullable: false,
  })
  public nickname: string;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
  })
  public description: string;

  @Column({
    name: 'username',
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  public username: string;

  @Column({
    name: 'dateOfBirth',
    type: 'date',
    nullable: false,
  })
  public dateOfBirth: Date;

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

  @OneToOne(() => User, (user) => user.account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @Column({
    enum: AccountRole,
  })
  public role: AccountRole;

  @ManyToMany(() => Chat, (chat) => chat.accounts)
  public chats: Chat[];

  @OneToMany(() => Chat, (chat) => chat.owner)
  public chatsOwned: Chat[];
}
