import { Component, OnInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { BlocService } from '../core/services/bloc.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Bloc } from '../core/models/bloc.model';
@Component({
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  selector: 'app-bloc',
  templateUrl: './bloc.component.html',
  styleUrls: ['./bloc.component.css']
})
export class BlocComponent implements OnInit {
  blocs: Bloc[] = [];
  nomBloc: string = '';
  capaciteBloc: string = '';
  isFiltered: boolean = false;
  isAdding: boolean = false;
  newBloc = { nomBloc: '', capaciteBloc: '' };
  capaciteMoyenne: number = 0;
  chart: any;

  constructor(private blocservice: BlocService) {}

  ngOnInit(): void {
    this.getAllBlocs();
    // this.blocservice.getCapaciteMoyenne().subscribe((data) => {
    //   this.capaciteMoyenne = data;
    //   this.createChart();
    // });


    Chart.register(...registerables);
  }

  
  getAllBlocs(): void {
    this.blocservice.getAllBlocs().subscribe((data: any) => {
      this.blocs = data;
    });
  }

  filterBlocs(): void {
    this.blocservice.filterBlocs(this.nomBloc, this.capaciteBloc).subscribe((data) => {
      console.log('Données retournées après filtrage:', data);
      this.blocs = data;
      this.isFiltered = true;
    }, error => {
      console.error('Erreur lors du filtrage des blocs:', error);
    });
  }

  deleteBloc(blocId: number): void {
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
        this.blocservice.deleteBloc(blocId).subscribe(
          (response) => {
            this.blocs = this.blocs.filter(bloc => bloc.idBloc !== blocId);
            Swal.fire(
              'Supprimé!',
              'Le bloc a été supprimé.',
              'success'
            );
          },
          (error) => {
            console.error('Erreur lors de la suppression du bloc', error);
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
      this.newBloc = { nomBloc: '', capaciteBloc: '' };
    }
  }

  addBloc(): void {
    this.blocservice.addBloc(this.newBloc).subscribe(
      (response) => {
        this.blocs.push(response);
        this.toggleAddForm();
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du bloc', error);
      }
    );
  }

createChart() {
  this.chart = new Chart('canvas', {
    type: 'pie',  
    data: {
      labels: ['Capacité moyenne'],  
      datasets: [
        {
          label: 'Capacité Moyenne des Blocs',
          data: [this.capaciteMoyenne], 
          backgroundColor: ['#42A5F5'], 
          borderColor: ['#1E88E5'],  
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  });
}

}
