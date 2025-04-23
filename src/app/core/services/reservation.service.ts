import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8093/api/reservations'; 

  constructor(private http: HttpClient) {}

  // Obtenir toutes les réservations
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/getAllReservations`);
  }

  // Créer une réservation
  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}`, reservation);
  }

  // Mettre à jour une réservation
  updateReservation(id: number, reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation);
  }

  // Supprimer une réservation
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Rechercher avec critères
  searchReservations(date?: string, keyword?: string, status?: boolean): Observable<Reservation[]> {
    let params = new HttpParams();
    if (date) params = params.set('reservationDate', date);
    if (keyword) params = params.set('keyword', keyword);
    if (status !== null && status !== undefined) params = params.set('status', status);

    return this.http.get<Reservation[]>(`${this.apiUrl}/search`, { params });
  }
}
