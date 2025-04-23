// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number;
  session_state: string;
  scope: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_URL = 'http://localhost:8181/realms/securitproject/protocol/openid-connect/token';
  private readonly STORAGE_KEY = 'auth_data';
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<TokenResponse> {
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', 'apigateway');
    body.set('username', username);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<TokenResponse>(this.AUTH_URL, body.toString(), { headers }).pipe(
      tap(response => {
        this.saveAuthData(response);
        this.authStatus.next(true);
      })
    );
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('client_id', 'apigateway');
    body.set('refresh_token', refreshToken);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<TokenResponse>(this.AUTH_URL, body.toString(), { headers }).pipe(
      tap(response => {
        this.saveAuthData(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.authStatus.next(false);
  }

  getAccessToken(): string | null {
    const authData = this.getAuthData();
    return authData?.access_token || null;
  }

  getRefreshToken(): string | null {
    const authData = this.getAuthData();
    return authData?.refresh_token || null;
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    // Optional: Check token expiration (JWT decode would be needed)
    return true;
  }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  private saveAuthData(data: TokenResponse): void {
    const authData = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + (data.expires_in * 1000),
      refresh_expires_at: Date.now() + (data.refresh_expires_in * 1000)
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
  }

  private getAuthData(): { 
    access_token: string; 
    refresh_token: string; 
    expires_at: number;
    refresh_expires_at: number;
  } | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }
}