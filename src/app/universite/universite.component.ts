import { Component, OnInit } from '@angular/core';
import { UniversiteService } from '../core/services/universite.service';
import { Universite } from '../core/models/universite.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-universite',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './universite.component.html',
  styleUrls: ['./universite.component.css']
})
export class UniversiteComponent implements OnInit {
  universites: Universite[] = [];
  selectedUniversite: Universite | null = null;
  newUniversite: Universite = { idUniversite: 0, nomUniversite: '', adresse: '' };
  searchId: number = 0;
  filterAddress: string = '';
  isLoading: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';

  constructor(private universiteService: UniversiteService) {}

  ngOnInit(): void {
    this.getAllUniversites();
  }

  getAllUniversites(): void {
    this.isLoading = true;
    this.hasError = false;
    
    this.universiteService.getAll().subscribe({
      next: (data) => {
        this.universites = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError('Erreur lors du chargement des universités', error);
      }
    });
  }

  getById(): void {
    if (!this.searchId) {
      this.hasError = true;
      this.errorMessage = 'Veuillez entrer un ID valide';
      return;
    }
    
    this.isLoading = true;
    this.hasError = false;
    
    this.universiteService.getById(this.searchId).subscribe({
      next: (data) => {
        this.selectedUniversite = data;
        this.isLoading = false;
        
        if (!data) {
          this.hasError = true;
          this.errorMessage = `Aucune université trouvée avec l'ID ${this.searchId}`;
        }
      },
      error: (error) => {
        this.handleError(`Erreur lors de la recherche de l'université avec l'ID ${this.searchId}`, error);
      }
    });
  }

  createUniversite(): void {
    // Validation
    if (!this.newUniversite.nomUniversite.trim() || !this.newUniversite.adresse.trim()) {
      this.hasError = true;
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }
    
    this.isLoading = true;
    this.hasError = false;
    
    this.universiteService.create(this.newUniversite).subscribe({
      next: () => {
        this.getAllUniversites();
        this.newUniversite = { idUniversite: 0, nomUniversite: '', adresse: '' };
      },
      error: (error) => {
        this.handleError('Erreur lors de la création de l\'université', error);
      }
    });
  }

  updateUniversite(): void {
    if (!this.selectedUniversite) {
      return;
    }
    
    // Validation
    if (!this.selectedUniversite.nomUniversite.trim() || !this.selectedUniversite.adresse.trim()) {
      this.hasError = true;
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }
    
    this.isLoading = true;
    this.hasError = false;
    
    this.universiteService.update(this.selectedUniversite).subscribe({
      next: () => {
        this.getAllUniversites();
        this.selectedUniversite = null;
      },
      error: (error) => {
        this.handleError('Erreur lors de la mise à jour de l\'université', error);
      }
    });
  }

  deleteUniversite(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette université ?')) {
      this.isLoading = true;
      this.hasError = false;
      
      this.universiteService.delete(id).subscribe({
        next: () => {
          this.getAllUniversites();
        },
        error: (error) => {
          this.handleError('Erreur lors de la suppression de l\'université', error);
        }
      });
    }
  }

  filterUniversites(): void {
    this.isLoading = true;
    this.hasError = false;
    
    this.universiteService.filterByAddress(this.filterAddress).subscribe({
      next: (data) => {
        this.universites = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError('Erreur lors du filtrage des universités', error);
      }
    });
  }

  selectUniversite(u: Universite): void {
    this.selectedUniversite = { ...u };
  }

  private handleError(message: string, error: any): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = `${message}: ${error.message || 'Une erreur s\'est produite'}`;
    console.error(message, error);
  }
}
