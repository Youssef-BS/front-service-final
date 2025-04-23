import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Universite } from '../models/universite.model';

@Injectable({
  providedIn: 'root'
})
export class UniversiteService {
  private apiUrl = 'http://localhost:8093/op/universite';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Universite[]> {
    return this.http.get<Universite[]>(`${this.apiUrl}/get-all-universites`);
  }

  getById(id: number): Observable<Universite> {
    return this.http.get<Universite>(`${this.apiUrl}/get-universite/${id}`);
  }

  create(universite: Universite): Observable<Universite> {
    return this.http.post<Universite>(`${this.apiUrl}/add-universite`, universite);
  }

  update(universite: Universite): Observable<Universite> {
    return this.http.put<Universite>(`${this.apiUrl}/update-universite`, universite);
  }

  delete(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/delete-universite/${id}`, {});
  }

  filterByAddress(address: string): Observable<Universite[]> {
    return this.http.get<Universite[]>(`${this.apiUrl}/filter?address=${address}`);
  }
}
