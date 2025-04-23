import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../core/services/reservation.service';
import { Reservation } from '../core/models/reservation.model';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  reservations: Reservation[] = [];

  newReservation: Reservation = {
    idReservation: 0,
    reservationDate: '',
    description: '',
    status: false
  };

  keyword: string = '';
  reservationDate: string = '';
  status: boolean | null = null;  // Changed to boolean for correct search filter

  isEditMode = false;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations(): void {
    this.reservationService.getReservations().subscribe({
      next: (data) => this.reservations = data,
      error: (err) => console.error('Error fetching reservations:', err)
    });
  }

  saveReservation(): void {
    if (this.isEditMode) {
      this.reservationService.updateReservation(this.newReservation.idReservation, this.newReservation).subscribe({
        next: () => {
          this.resetForm();
          this.fetchReservations();
        }
      });
    } else {
      this.reservationService.createReservation(this.newReservation).subscribe({
        next: () => {
          this.resetForm();
          this.fetchReservations();
        }
      });
    }
  }

  editReservation(reservation: Reservation): void {
    this.newReservation = { ...reservation };
    this.isEditMode = true;
  }

  deleteReservation(id: number): void {
    if (confirm('Are you sure you want to delete this reservation?')) {
      this.reservationService.deleteReservation(id).subscribe({
        next: () => this.fetchReservations()
      });
    }
  }

  resetForm(): void {
    this.newReservation = {
      idReservation: 0,
      reservationDate: '',
      description: '',
      status: false
    };
    this.isEditMode = false;
  }

  searchReservations(): void {
    // Convert date to string or undefined
    const date = this.reservationDate ? this.reservationDate : undefined;
    
    // Convert status to undefined if it's null (to match the expected type for HttpParams)
    const statusValue: boolean | undefined = this.status === null ? undefined : this.status;
  
    this.reservationService.searchReservations(date, this.keyword, statusValue).subscribe({
      next: (data) => this.reservations = data,
      error: (err) => console.error('Error searching reservations:', err)
    });
  }
  
}
