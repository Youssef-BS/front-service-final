import { Routes } from '@angular/router';
import { ReservationComponent } from './reservation/reservation.component';
import { BlocComponent } from './bloc/bloc.component';
import { BlocUpdateComponent } from './bloc-update/bloc-update.component';
import { UniversiteComponent } from './universite/universite.component';
import { FoyerListComponent } from './foyer-list/foyer-list.component';
import { HomeComponent } from './home/home.component';
import { ChambreComponent } from './chambre/chambre.component';
import { ChambresDisponiblesComponent } from './chambres-disponibles/chambres-disponibles.component';
import { ChambreMapsComponent } from './chambre-maps/chambre-maps.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'reservations', 
    component: ReservationComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'bloc', 
    component: BlocComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'update-bloc/:id', 
    component: BlocUpdateComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'universite', 
    component: UniversiteComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'foyer', 
    component: FoyerListComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'chambre', 
    component: ChambreComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'chambres-disponibles', 
    component: ChambresDisponiblesComponent,
    canActivate: [authGuard] 
  },
  { 
    path: 'chambre-map', 
    component: ChambreMapsComponent,
    canActivate: [authGuard] 
  },
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];