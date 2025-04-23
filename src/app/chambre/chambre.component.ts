import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ChambreService } from '../core/services/chambre.service';
import { BlocService } from '../core/services/bloc.service';
import { Chambre } from '../core/models/chambre.model';
import { Bloc } from '../core/models/bloc.model';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  selector: 'app-chambre',
  templateUrl: './chambre.component.html',
  styleUrls: ['./chambre.component.css']
})
export class ChambreComponent implements OnInit {
  chambres: Chambre[] = [];
  blocs: Bloc[] = [];
  numeroChambre: string = '';
  blocId: string = '';
  isFiltered: boolean = false;
  isAdding: boolean = false;
  isEditing: boolean = false;
  currentChambre: Chambre | null = null;
  newChambre: Chambre = { 
    numeroChambre: 0, 
    typeC: '', 
    prix: 0
  };
  
  // For image upload
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private chambreService: ChambreService,
    private blocService: BlocService
  ) {}

  ngOnInit(): void {
    this.getAllChambres();
    this.getAllBlocs();
  }

  getAllChambres(): void {
    this.chambreService.getAllChambres().subscribe((data: any) => {
      this.chambres = data;
    });
  }

  getAllBlocs(): void {
    this.blocService.getAllBlocs().subscribe((data: any) => {
      this.blocs = data;
    });
  }

  filterChambres(): void {
    this.chambreService.filterChambres(this.numeroChambre, this.blocId).subscribe((data) => {
      console.log('Données retournées pour filtrage:', data);
      // Apply client-side filtering since the backend doesn't support it
      let filteredData = [...data];
      
      if (this.numeroChambre) {
        filteredData = filteredData.filter(chambre => 
          chambre.numeroChambre.toString().includes(this.numeroChambre)
        );
      }
      
      if (this.blocId) {
        filteredData = filteredData.filter(chambre => 
          chambre.bloc && chambre.bloc.idBloc === parseInt(this.blocId)
        );
      }
      
      this.chambres = filteredData;
      this.isFiltered = true;
    }, error => {
      console.error('Erreur lors du filtrage des chambres:', error);
    });
  }

  deleteChambre(chambreId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas annuler cette action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.chambreService.deleteChambre(chambreId).subscribe(
          (response) => {
            this.chambres = this.chambres.filter(chambre => chambre.idChambre !== chambreId);
            Swal.fire(
              'Supprimé!',
              'La chambre a été supprimée.',
              'success'
            );
          },
          (error) => {
            console.error('Erreur lors de la suppression de la chambre', error);
            Swal.fire(
              'Erreur',
              'Une erreur est survenue lors de la suppression',
              'error'
            );
          }
        );
      }
    });
  }

  toggleAddForm(): void {
    this.isAdding = !this.isAdding;
    if (!this.isAdding) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newChambre = { 
      numeroChambre: 0, 
      typeC: '', 
      prix: 0
    };
    this.selectedFile = null;
    this.imagePreview = null;
  }

  addChambre(): void {
    this.chambreService.addChambre(this.newChambre).subscribe(
      (response) => {
        // If there's a file selected, upload it
        if (this.selectedFile && response.idChambre) {
          this.uploadImage(response.idChambre);
        } else {
          this.completeAddChambre(response);
        }
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de la chambre', error);
        Swal.fire(
          'Erreur',
          'Une erreur est survenue lors de l\'ajout',
          'error'
        );
      }
    );
  }

  uploadImage(chambreId: number): void {
    if (!this.selectedFile) return;
    
    this.chambreService.uploadImage(this.selectedFile, chambreId).subscribe(
      (response) => {
        const updatedChambre = this.chambres.find(c => c.idChambre === chambreId);
        if (updatedChambre) {
          updatedChambre.image = response.imageUrl;
        }
        this.completeAddChambre({ ...this.newChambre, idChambre: chambreId, image: response.imageUrl });
      },
      (error) => {
        console.error('Erreur lors de l\'upload de l\'image', error);
        // Still complete the process even if image upload fails
        this.completeAddChambre({ ...this.newChambre, idChambre: chambreId });
      }
    );
  }

  completeAddChambre(chambre: Chambre): void {
    this.chambres.push(chambre);
    this.toggleAddForm();
    Swal.fire(
      'Ajouté!',
      'La chambre a été ajoutée avec succès.',
      'success'
    );
  }

  startEdit(chambre: Chambre): void {
    this.isEditing = true;
    this.currentChambre = { ...chambre };
    this.newChambre = { ...chambre };
    
    if (chambre.image) {
      this.imagePreview = chambre.image;
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.currentChambre = null;
    this.resetForm();
  }

  updateChambre(): void {
    if (!this.currentChambre || !this.currentChambre.idChambre) return;

    this.chambreService.updateChambre(this.currentChambre.idChambre, this.newChambre).subscribe(
      (response) => {
        // If there's a file selected, upload it
        if (this.selectedFile && this.currentChambre && this.currentChambre.idChambre) {
          this.uploadImageForUpdate(this.currentChambre.idChambre, response);
        } else {
          this.completeUpdateChambre(response);
        }
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la chambre', error);
        Swal.fire(
          'Erreur',
          'Une erreur est survenue lors de la mise à jour',
          'error'
        );
      }
    );
  }

  uploadImageForUpdate(chambreId: number, updatedChambre: Chambre): void {
    if (!this.selectedFile) return;
    
    this.chambreService.uploadImage(this.selectedFile, chambreId).subscribe(
      (response) => {
        updatedChambre.image = response.imageUrl;
        this.completeUpdateChambre(updatedChambre);
      },
      (error) => {
        console.error('Erreur lors de l\'upload de l\'image', error);
        // Still complete the update even if image upload fails
        this.completeUpdateChambre(updatedChambre);
      }
    );
  }

  completeUpdateChambre(chambre: Chambre): void {
    const index = this.chambres.findIndex(c => c.idChambre === chambre.idChambre);
    if (index !== -1) {
      this.chambres[index] = chambre;
    }
    this.cancelEdit();
    Swal.fire(
      'Mis à jour!',
      'La chambre a été mise à jour avec succès.',
      'success'
    );
  }

  getBlocName(blocId: number): string {
    const bloc = this.blocs.find(b => b.idBloc === blocId);
    return bloc ? bloc.nomBloc : 'Non assigné';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      
      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
} 