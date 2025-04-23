import { Component, OnInit, HostListener, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatBotComponent } from './shared/chat-bot/chat-bot.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ChatBotComponent],
  template: `
    <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <style>
        .navbar {
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg,black 0%, black 100%);
        }
        
        .navbar-brand {
          font-size: 1.5rem;
          font-weight: 700;
          display: flex;
          align-items: center;
        }
        
        .navbar-brand::before {
          content: "🏛️";
          margin-right: 0.5rem;
          font-size: 1.8rem;
        }
        
        .nav-link {
          font-weight: 500;
          padding: 0.5rem 1rem;
          margin: 0 0.1rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }
        
        .nav-link i {
          margin-right: 0.4rem;
          font-size: 1.1rem;
        }
        
        .nav-link:hover, .nav-link:focus {
          background-color: rgba(255, 255, 255, 0.15);
        }
        
        .nav-link.active {
          background-color: rgba(255, 255, 255, 0.25);
          font-weight: 600;
        }
        
        .profile-dropdown .dropdown-toggle::after {
          display: none;
        }
        
        .profile-img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.3);
          margin-right: 0.5rem;
        }
        
        .dropdown-item i {
          margin-right: 0.4rem;
        }
        
        .dropdown-item.active, .dropdown-item:active {
          background-color: #0d6efd;
          color: white;
        }
        
        .chambre-badge {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(50%, -30%);
          font-size: 0.6rem;
        }
        
        /* Custom dropdown menu */
        .custom-dropdown {
          position: relative;
        }
        
        .custom-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 1000;
          display: none;
          min-width: 10rem;
          padding: 0.5rem 0;
          margin: 0.125rem 0 0;
          background-color: #343a40;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.25rem;
        }
        
        .custom-dropdown-menu.show {
          display: block;
        }
        
        .custom-dropdown-item {
          display: block;
          width: 100%;
          padding: 0.5rem 1rem;
          clear: both;
          font-weight: 400;
          color: white;
          text-align: inherit;
          text-decoration: none;
          white-space: nowrap;
          background-color: transparent;
          border: 0;
        }
        
        .custom-dropdown-item:hover, .custom-dropdown-item:focus {
          color: white;
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .custom-dropdown-item.active {
          color: white;
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .chambres-menu .custom-dropdown-item i {
          margin-right: 0.5rem;
        }
        
        .chambre-parent {
          color: #ffc107 !important;
          font-weight: bold;
        }
        
        .chambre-disponible {
          color: #28a745 !important;
        }
        
        .chambre-map {
          color: #17a2b8 !important;
        }
        
        /* For desktop - hover support */
        @media (min-width: 992px) {
          .custom-dropdown:hover .custom-dropdown-menu {
            display: block;
          }
        }
        
        @media (max-width: 991.98px) {
          .navbar-collapse {
            padding: 1rem 0;
          }
          .nav-link {
            margin: 0.25rem 0;
            padding: 0.75rem 1rem;
          }
          .custom-dropdown-menu {
            position: static;
            float: none;
            width: auto;
            margin-top: 0;
            background-color: transparent;
            border: 0;
            box-shadow: none;
            padding-left: 1.5rem;
          }
          .custom-dropdown-item {
            padding: 0.5rem 1rem;
          }
          .custom-dropdown .nav-link::after {
            display: inline-block;
            margin-left: 0.5em;
            vertical-align: 0.2em;
            content: "";
            border-top: 0.3em solid;
            border-right: 0.3em solid transparent;
            border-bottom: 0;
            border-left: 0.3em solid transparent;
          }
        }
      </style>
    </head>

    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">CampusManager</a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" 
                aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" routerLink="/home" routerLinkActive="active">
                <i class="bi bi-house-door"></i> Accueil
              </a>
            </li>
            
            <!-- Chambres dropdown menu -->
            <li class="nav-item custom-dropdown">
              <a class="nav-link position-relative chambre-parent" (click)="toggleChambreMenu($event)">
                <i class="bi bi-house-door-fill"></i> Chambres
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger chambre-badge">
                  New
                </span>
              </a>
              
              <!-- Chambres dropdown menu -->
              <div class="custom-dropdown-menu" [ngClass]="{'show': isChambreMenuOpen}">
                <a class="custom-dropdown-item" routerLink="/chambre" routerLinkActive="active">
                  <i class="bi bi-list-check"></i> Liste des Chambres
                </a>
                <a class="custom-dropdown-item chambre-disponible" routerLink="/chambres-disponibles" routerLinkActive="active">
                  <i class="bi bi-check-circle"></i> Chambres Disponibles
                </a>
                <a class="custom-dropdown-item chambre-map" routerLink="/chambre-map" routerLinkActive="active">
                  <i class="bi bi-geo-alt"></i> Carte des Chambres
                </a>
              </div>
            </li>
            
            <li class="nav-item">
              <a class="nav-link" routerLink="/reservations" routerLinkActive="active">
                <i class="bi bi-calendar-check"></i> Réservations
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/bloc" routerLinkActive="active">
                <i class="bi bi-building"></i> Blocs
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/universite" routerLinkActive="active">
                <i class="bi bi-bank"></i> Universités
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/foyer" routerLinkActive="active">
                <i class="bi bi-house-heart"></i> Foyers
              </a>
            </li>
          </ul>
          
          <ul class="navbar-nav ms-auto">
            <li class="nav-item dropdown profile-dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="profileDropdown" role="button" 
                data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://ui-avatars.com/api/?name=Admin&background=ffffff&color=0d6efd&bold=true" 
                    class="profile-img" alt="Profile">
                <span class="d-none d-lg-inline">Admin</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="bi bi-person me-2"></i> Mon Profil
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="bi bi-gear me-2"></i> Paramètres
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item text-danger" href="#">
                    <i class="bi bi-box-arrow-right me-2" ></i> Déconnexion
                  </a>
                </li>
              </ul>
            </li>
            <li class="nav-item d-lg-none">
              <a class="nav-link" href="#">
                <i class="bi bi-box-arrow-right"></i> Déconnexion
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <main class="flex-fill container my-4">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-dark text-white text-center py-3 mt-auto">
      <div class="container">
        <p class="mb-0">&copy; 2025 CampusManager. Tous droits réservés.</p>
      </div>
    </footer>

    <!-- Bootstrap JS bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Add the chat bot to the template before the closing body tag -->
    <app-chat-bot></app-chat-bot>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  // State for the Chambres dropdown menu
  isChambreMenuOpen = false;
  
  // Inject AuthService
  private authService = inject(AuthService);

  constructor() {}

  // Toggle the Chambres dropdown menu
  toggleChambreMenu(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isChambreMenuOpen = !this.isChambreMenuOpen;
  }
  
  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  closeDropdowns(event: Event): void {
    // Check if the click is outside the dropdown area
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.isChambreMenuOpen = false;
    }
  }
  
  ngOnInit() {

  }
}