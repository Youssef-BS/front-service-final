// src/app/auth/login/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form (ngSubmit)="login()">
        <div>
          <label for="username">Username:</label>
          <input id="username" [(ngModel)]="username" name="username" required>
        </div>
        <div>
          <label for="password">Password:</label>
          <input id="password" type="password" [(ngModel)]="password" name="password" required>
        </div>
        <button type="submit">Login</button>
      </form>
      <div *ngIf="error" class="error">{{ error }}</div>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .error { color: red; }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = 'testuser';
  password = 'test123';
  error = '';

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => this.error = 'Login failed. Please check your credentials.'
    });
  }
}