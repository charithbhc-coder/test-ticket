import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ticket {
  id: number;
  message: string;
  teamsUserName: string;
  status: string;
  reply: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:3000/api/tickets';

  constructor(private http: HttpClient) {}

  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  replyToTicket(ticketId: number, reply: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reply`, { ticketId, reply });
  }
}
