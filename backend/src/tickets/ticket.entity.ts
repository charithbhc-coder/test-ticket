import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  message: string;

  @Column()
  teamsUserId: string;

  @Column()
  teamsUserName: string;

  @Column({ nullable: true })
  senderEmail: string;

  @Column({ nullable: true })
  messageId: string;

  @Column({ nullable: true })
  channelId: string;

  @Column({ nullable: true })
  teamId: string;

  @Column({ default: 'OPEN' })
  status: string;

  @Column('text', { nullable: true })
  reply: string;

  @CreateDateColumn()
  createdAt: Date;
}
