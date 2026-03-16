import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { TicketService, Ticket } from '../ticket.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tickets: Ticket[] = [];
  displayedColumns: string[] = ['id', 'teamsUserName', 'message', 'status', 'reply'];
  replyTexts: { [key: number]: string } = {};
  isSending: { [key: number]: boolean } = {};

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe({
      next: (data) => {
        this.tickets = data;
      },
      error: (err) => console.error('Failed to load tickets', err)
    });
  }

  sendReply(ticket: Ticket): void {
    const replyText = this.replyTexts[ticket.id];
    if (!replyText || !replyText.trim()) return;

    this.isSending[ticket.id] = true;
    this.ticketService.replyToTicket(ticket.id, replyText).subscribe({
      next: () => {
        this.isSending[ticket.id] = false;
        this.replyTexts[ticket.id] = '';
        this.loadTickets(); // Reload to get updated status and reply
      },
      error: (err) => {
        console.error('Failed to send reply', err);
        this.isSending[ticket.id] = false;
        alert('Failed to send reply, check console for details');
      }
    });
  }
}
