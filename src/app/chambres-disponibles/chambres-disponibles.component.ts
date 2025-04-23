import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChambreService } from '../core/services/chambre.service';
import { BlocService } from '../core/services/bloc.service';
import { Chambre } from '../core/models/chambre.model';
import { Bloc } from '../core/models/bloc.model';

@Component({
  selector: 'app-chambres-disponibles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chambres-disponibles.component.html',
  styleUrl: './chambres-disponibles.component.css'
})
export class ChambresDisponiblesComponent implements OnInit {
  chambresDisponibles: Chambre[] = [];
  blocs: Bloc[] = [];
  filteredChambres: Chambre[] = [];
  
  // Filter options
  typeFilter: string = '';
  blocFilter: string = '';
  prixMinFilter: number | null = null;
  prixMaxFilter: number | null = null;
  
  // Sorting
  sortOption: string = 'prix_asc';
  
  isLoading: boolean = true;
  
  constructor(
    private chambreService: ChambreService,
    private blocService: BlocService
  ) {}
  
  ngOnInit(): void {
    this.loadChambresDisponibles();
    this.loadBlocs();
  }
  
  loadChambresDisponibles(): void {
    this.isLoading = true;
    this.chambreService.getChambresDisponibles().subscribe({
      next: (chambres) => {
        // Only keep available rooms
        this.chambresDisponibles = chambres.filter(chambre => chambre.isAvailable);
        this.applyFiltersAndSort();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading available rooms:', error);
        this.isLoading = false;
      }
    });
  }
  
  loadBlocs(): void {
    this.blocService.getAllBlocs().subscribe({
      next: (blocs) => {
        this.blocs = blocs;
      },
      error: (error) => {
        console.error('Error loading blocs:', error);
      }
    });
  }
  
  applyFilters(): void {
    this.applyFiltersAndSort();
  }
  
  applyFiltersAndSort(): void {
    // First filter the rooms
    this.filteredChambres = this.chambresDisponibles.filter(chambre => {
      // Filter by type if selected
      if (this.typeFilter && chambre.typeC !== this.typeFilter) {
        return false;
      }
      
      // Filter by bloc if selected
      if (this.blocFilter && (!chambre.bloc || chambre.bloc.idBloc.toString() !== this.blocFilter)) {
        return false;
      }
      
      // Filter by price range
      if (this.prixMinFilter && (chambre.prix || 0) < this.prixMinFilter) {
        return false;
      }
      
      if (this.prixMaxFilter && (chambre.prix || 0) > this.prixMaxFilter) {
        return false;
      }
      
      return true;
    });
    
    // Then sort them
    this.sortRooms();
  }
  
  sortRooms(): void {
    switch(this.sortOption) {
      case 'prix_asc':
        this.filteredChambres.sort((a, b) => (a.prix || 0) - (b.prix || 0));
        break;
      case 'prix_desc':
        this.filteredChambres.sort((a, b) => (b.prix || 0) - (a.prix || 0));
        break;
      case 'rating':
        this.filteredChambres.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      default:
        // Default sort by room number
        this.filteredChambres.sort((a, b) => a.numeroChambre - b.numeroChambre);
    }
  }
  
  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortOption = select.value;
    this.sortRooms();
  }
  
  resetFilters(): void {
    this.typeFilter = '';
    this.blocFilter = '';
    this.prixMinFilter = null;
    this.prixMaxFilter = null;
    this.sortOption = 'prix_asc';
    this.filteredChambres = [...this.chambresDisponibles];
    this.sortRooms();
  }
  
  getBlocName(blocId: number): string {
    const bloc = this.blocs.find(b => b.idBloc === blocId);
    return bloc ? bloc.nomBloc : 'Non assigné';
  }
  
  reserverChambre(chambre: Chambre): void {
    if (confirm(`Voulez-vous réserver la chambre ${chambre.numeroChambre} pour ${chambre.prix} DT?`)) {
      // In a real app, you would call a reservation service here
      alert(`Réservation confirmée pour la chambre ${chambre.numeroChambre}!`);
      
      // Update the availability status
      chambre.isAvailable = false;
      
      // Remove from the filtered list
      this.filteredChambres = this.filteredChambres.filter(c => c.idChambre !== chambre.idChambre);
      
      // Also remove from the main list
      this.chambresDisponibles = this.chambresDisponibles.filter(c => c.idChambre !== chambre.idChambre);
    }
  }
}
