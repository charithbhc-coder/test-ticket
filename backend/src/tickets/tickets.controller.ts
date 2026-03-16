import { Controller, Get, Post, Body } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Ticket } from './ticket.entity';

@Controller('api/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  createTicket(
    @Body('message') message: string,
    @Body('teamsUserId') teamsUserId: string,
    @Body('teamsUserName') teamsUserName: string,
    @Body('senderEmail') senderEmail?: string,
    @Body('messageId') messageId?: string,
    @Body('channelId') channelId?: string,
    @Body('teamId') teamId?: string,
  ) {
    return this.ticketsService.createTicket(
      message,
      teamsUserId,
      teamsUserName,
      senderEmail,
      messageId,
      channelId,
      teamId,
    );
  }

  @Get()
  getTickets() {
    return this.ticketsService.getTickets();
  }

  @Post('reply')
  replyToTicket(
    @Body('ticketId') ticketId: number,
    @Body('reply') reply: string,
  ) {
    return this.ticketsService.replyToTicket(ticketId, reply);
  }
}
