import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
@Injectable({
  providedIn: 'root'
})
export class BlocService {
  private apiUrl = 'http://localhost:8093/microService/bloc'; 

  constructor(private http: HttpClient) {}

 
  getAllBlocs(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getBlocById(blocId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${blocId}`);
  }
  
  updateBloc(bloc: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${bloc.idBloc}`, bloc);  
  }
  
  deleteBloc(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  filterBlocs(nomBloc: string, capaciteBloc: string): Observable<any> {
    const params = new HttpParams()
      .set('nomBloc', nomBloc)
      .set('capaciteBloc', capaciteBloc);
    return this.http.get(`${this.apiUrl}/filter`, { params });
  }
  addBloc(bloc: any): Observable<any> {
    return this.http.post(this.apiUrl, bloc);
  }
  // getCapaciteMoyenne(): Observable<number> {
  //   return this.http.get<number>(`${this.apiUrl}/capacite-moyenne`).pipe(
  //     catchError((error) => {
  //       console.error('Error occurred:', error);
      
  //       throw error;
  //     })
  //   );
  // }
  
  
}
