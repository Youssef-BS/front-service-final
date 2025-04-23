import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { BlocService } from '../core/services/bloc.service';
import { CommonModule } from '@angular/common';
import { Bloc } from '../core/models/bloc.model';

@Component({
  standalone: true,
  imports: [FormsModule,CommonModule],
  selector: 'app-bloc-update',
  templateUrl: './bloc-update.component.html',
  styleUrls: ['./bloc-update.component.css']
})
export class BlocUpdateComponent implements OnInit {
  bloc: Bloc = { nomBloc: '', capaciteBloc: '' };

  isLoading: boolean = true; 
  constructor(
    private blocservice: BlocService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit appelé');  
    const blocId = this.route.snapshot.paramMap.get('id');

    if (blocId && !isNaN(Number(blocId))) {
      console.log('ID du bloc récupéré:', blocId);  
      this.getBlocById(blocId);
    } else {
      console.error('ID du bloc invalide ou manquant');
      this.router.navigate(['/bloc']);  
    }
  }

  getBlocById(id: string): void {
    console.log('Tentative de récupération du bloc avec ID:', id);  
    this.blocservice.getBlocById(Number(id)).subscribe(
      (data) => {
        console.log('Données du bloc récupérées:', data);  
        this.bloc = data;
        this.isLoading = false;  
      },
      (error) => {
        console.error('Erreur lors de la récupération du bloc:', error);
        this.router.navigate(['/bloc']); 
      }
    );
  }

  updateBloc(): void {
    console.log('Tentative de mise à jour du bloc:', this.bloc);  
    this.blocservice.updateBloc(this.bloc).subscribe(
      (response) => {
        console.log('Bloc mis à jour avec succès', response);
        this.router.navigate(['/bloc']);  
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du bloc', error);
      }
    );
  }
}
