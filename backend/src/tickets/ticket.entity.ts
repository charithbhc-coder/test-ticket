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

  @Column({ default: 'OPEN' })
  status: string;

  @Column('text', { nullable: true })
  reply: string;

  @CreateDateColumn()
  createdAt: Date;
}
