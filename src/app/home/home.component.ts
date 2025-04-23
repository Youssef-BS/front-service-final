import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngClass
import { Router } from '@angular/router';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule], // Import RouterLink and RouterModule
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Define the recentActivities property
  recentActivities = [
    {
      date: new Date(),
      type: 'Bloc',
      description: 'Un nouveau bloc a été ajouté.',
    },
    {
      date: new Date(),
      type: 'Foyer',
      description: 'Le foyer A a été rénové.',
    },
    {
      date: new Date(),
      type: 'Réservation',
      description: 'Une nouvelle réservation a été effectuée.',
    },
    {
      date: new Date(),
      type: 'Chambre',
      description: 'Nouvelle chambre disponible.',
    }
  ];

  // Optionally, initialize other properties like totalUniversities, etc.
  totalUniversities = 5;
  totalFoyers = 10;
  totalBlocs = 15;
  totalChambres = 20;
  totalReservations = 25;

  constructor(private router: Router) {}

  navigateToPage(event: Event, route: string) {
    event.preventDefault(); // Prevent default link behavior
    console.log(`Navigating to ${route} page...`);
    this.router.navigate([`/${route}`]);
  }
}
