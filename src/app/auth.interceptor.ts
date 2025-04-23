// src/app/core/auth/auth.interceptor.ts
import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './core/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  // Skip adding token for auth requests
  if (req.url.includes('protocol/openid-connect/token')) {
    return next(req);
  }

  const token = authService.getAccessToken();
  const authReq = token 
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = authService.getAccessToken();
            const newReq = newToken 
              ? req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } })
              : req;
            return next(newReq);
          }),
          catchError(err => {
            authService.logout();
            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};