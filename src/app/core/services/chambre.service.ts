import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Chambre } from '../models/chambre.model';

@Injectable({
  providedIn: 'root'
})
export class ChambreService {
  private apiUrl = 'http://localhost:8093/ap/chambre';

  constructor(private http: HttpClient) { }

  getAllChambres(): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.apiUrl}/get-all-chambres`);
  }

  getChambreById(id: number): Observable<Chambre> {
    return this.http.get<Chambre>(`${this.apiUrl}/get-chambre/${id}`);
  }

  addChambre(chambre: Chambre): Observable<Chambre> {
    return this.http.post<Chambre>(`${this.apiUrl}/add-chambre`, chambre);
  }

  updateChambre(id: number, chambre: Chambre): Observable<Chambre> {
    return this.http.put<Chambre>(`${this.apiUrl}/update-chambre/${id}`, chambre);
  }

  deleteChambre(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-chambre/${id}`);
  }

  filterChambres(numeroChambre: string, blocId: string): Observable<Chambre[]> {
    let url = `${this.apiUrl}/get-all-chambres`;
    // API doesn't support filtering, we'll do it client-side
    return this.http.get<Chambre[]>(url);
  }

  uploadImage(file: File, chambreId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chambreId', chambreId.toString());
    
    return this.http.post(`${this.apiUrl}/upload-image`, formData);
  }

  assignChambreToBloc(chambreId: number, blocId: number): Observable<Chambre> {
    return this.http.put<Chambre>(`${this.apiUrl}/update-chambre/${chambreId}`, { blocId: blocId });
  }

  getChambresDisponibles(): Observable<Chambre[]> {
    // Get all rooms from the API
    return this.http.get<Chambre[]>(`${this.apiUrl}/get-all-chambres`).pipe(
      map(chambres => {
        // In a real application, we would check reservations to determine availability
        // For demonstration, we'll mark all rooms as available with some random data
        return chambres.map(chambre => {
          return {
            ...chambre,
            typeC: chambre.typeC || this.getRandomRoomType(),
            averageRating: chambre.averageRating || this.getRandomRating(),
            totalRatings: chambre.totalRatings || Math.floor(Math.random() * 50) + 5,
            prix: chambre.prix || Math.floor(Math.random() * 300) + 200,
            isAvailable: true // Add availability flag
          };
        });
      })
    );
  }

  getChambresWithLocation(): Observable<Chambre[]> {
    // Tunisia center coordinates
    const tunisiaCenter = { lat: 36.8065, lng: 10.1815 };
    
    // Get all rooms and add random locations around Tunisia center
    return this.getAllChambres().pipe(
      map(chambres => {
        return chambres.map(chambre => {
          // Generate random position within ~5km of the center
          const location = this.getRandomLocation(tunisiaCenter);
          
          return {
            ...chambre,
            typeC: chambre.typeC || this.getRandomRoomType(),
            averageRating: chambre.averageRating || this.getRandomRating(),
            totalRatings: chambre.totalRatings || Math.floor(Math.random() * 50) + 5,
            prix: chambre.prix || Math.floor(Math.random() * 300) + 200,
            isAvailable: Math.random() > 0.3, // 70% of rooms are available
            location: location
          };
        });
      })
    );
  }

  // Helper methods for demo data
  private getRandomRoomType(): string {
    const types = ['SIMPLE', 'DOUBLE', 'TRIPLE'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private getRandomRating(): number {
    return Number((Math.random() * 3 + 2).toFixed(1)); // Random rating between 2.0 and 5.0
  }

  private getRandomLocation(center: { lat: number, lng: number }): { lat: number, lng: number } {
    const radius = 0.05; // Roughly 5km radius
    const x0 = center.lng;
    const y0 = center.lat;
    
    // Convert to radians
    const rd = radius / 111.32; // roughly 111.32 km per degree
    
    // Get random angle and radius
    const u = Math.random();
    const v = Math.random();
    
    const w = rd * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    
    // Calculate offset
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);
    
    return {
      lat: y0 + y,
      lng: x0 + x
    };
  }
} 