export interface Reservation {
  idReservation: number;
  reservationDate: string; 
  description: string;
  status: boolean;
  etudiants?: any[];
}