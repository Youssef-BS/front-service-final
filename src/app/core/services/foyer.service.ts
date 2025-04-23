import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Foyer, Foyerr } from '../models/foyer.model';

@Injectable({
  providedIn: 'root'
})
export class FoyerService {
  private apiUrl = 'http://localhost:8093/ms/foyer'; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const authData = localStorage.getItem('auth_data');
    if (!authData) {
      throw new Error('No authentication data found');
    }
    
    const { access_token } = JSON.parse(authData);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    });
  }

  getFoyers(): Observable<Foyer[]> {
    return this.http.get<Foyer[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  updateFoyer(foyer: Foyer): Observable<Foyer> {
    return this.http.put<Foyer>(`${this.apiUrl}`, foyer, {
      headers: this.getAuthHeaders()
    });
  }

  deleteFoyer(idFoyer: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idFoyer}`, {
      headers: this.getAuthHeaders()
    });
  }

  addFoyer(newFoyer: Foyerr): Observable<Foyer> {
    return this.http.post<Foyer>(this.apiUrl, newFoyer, {
      headers: this.getAuthHeaders()
    });
  }
}