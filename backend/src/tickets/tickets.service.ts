import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import axios from 'axios';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  async createTicket(
    message: string,
    teamsUserId: string,
    teamsUserName: string,
    senderEmail?: string,
    messageId?: string,
    channelId?: string,
    teamId?: string,
  ): Promise<any> {
    const ticket = this.ticketsRepository.create({
      message,
      teamsUserId,
      teamsUserName,
      senderEmail,
      messageId,
      channelId,
      teamId,
      status: 'OPEN',
    });
    const saved = await this.ticketsRepository.save(ticket);
    return {
      id: saved.id,
      status: saved.status,
    };
  }

  async getTickets(): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      order: {
        createdAt: 'DESC',
      },
      select: [
        'id',
        'message',
        'teamsUserName',
        'senderEmail',
        'status',
        'reply',
      ],
    });
  }

  async replyToTicket(ticketId: number, reply: string): Promise<any> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id: ticketId },
    });
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.reply = reply;
    ticket.status = 'RESOLVED';
    await this.ticketsRepository.save(ticket);

    const webhookUrl = process.env.POWER_AUTOMATE_WEBHOOK;
    if (webhookUrl) {
      try {
        await axios.post(webhookUrl, {
          teamId: ticket.teamId,
          channelId: ticket.channelId,
          messageId: ticket.messageId,
          reply: reply,
        });
      } catch (error) {
        console.error('Failed to call Power Automate webhook', error);
        throw new InternalServerErrorException('Webhook call failed');
      }
    } else {
      console.warn('POWER_AUTOMATE_WEBHOOK not set. Webhook not called.');
    }

    return ticket;
  }
}
