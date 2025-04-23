/// <reference types="google.maps" />
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChambreService } from '../core/services/chambre.service';
import { Chambre } from '../core/models/chambre.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-chambre-maps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chambre-maps.component.html',
  styleUrl: './chambre-maps.component.css'
})
export class ChambreMapsComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  
  // Map properties
  map: any;
  markers: any[] = [];
  
  // Chambre data
  chambres: Chambre[] = [];
  selectedChambre: Chambre | null = null;
  
  // Default map center (Tunisia coordinates)
  center = { lat: 36.8065, lng: 10.1815 };
  
  constructor(private chambreService: ChambreService) {}
  
  ngOnInit(): void {
    this.loadChambresWithLocation();
    this.initMap();
  }
  
  loadChambresWithLocation(): void {
    this.chambreService.getChambresWithLocation().subscribe({
      next: (data) => {
        this.chambres = data;
        // After loading chambres, add markers if map is ready
        if (this.map) {
          this.addMarkersForChambres();
        }
      },
      error: (error) => {
        console.error('Error loading chambres for map:', error);
      }
    });
  }

  initMap(): void {
    // Check if Google Maps API is loaded asynchronously
    if (typeof google === 'undefined') {
      // Wait for Google Maps to load
      const checkGoogleInterval = setInterval(() => {
        if (typeof google !== 'undefined') {
          clearInterval(checkGoogleInterval);
          this.setupMap();
        }
      }, 100);
      
      // Set a timeout to stop checking after 10 seconds
      setTimeout(() => {
        clearInterval(checkGoogleInterval);
        if (typeof google === 'undefined') {
          console.error('Google Maps failed to load within the timeout period');
        }
      }, 10000);
    } else {
      this.setupMap();
    }
  }
  
  setupMap(): void {
    try {
      // Create the map instance
      this.map = new google.maps.Map(this.mapContainer.nativeElement, {
        center: this.center,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
        },
        scaleControl: true,
        streetViewControl: true,
        fullscreenControl: true
      });
      
      // Add chambre markers if data is already loaded
      if (this.chambres.length > 0) {
        this.addMarkersForChambres();
      }
    } catch (error) {
      console.error('Error setting up Google Maps:', error);
    }
  }
  
  addMarkersForChambres(): void {
    if (!this.map || !this.chambres.length) return;
    
    // Clear any existing markers
    this.clearMarkers();
    
    this.chambres.forEach(chambre => {
      if (chambre.location) {
        try {
          // Create marker
          const marker = new google.maps.Marker({
            position: chambre.location,
            map: this.map,
            title: `Chambre ${chambre.numeroChambre}`,
            animation: google.maps.Animation.DROP,
            icon: {
              url: chambre.isAvailable ? 
                'https://maps.google.com/mapfiles/ms/icons/green-dot.png' : 
                'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }
          });
          
          // Add click listener to show info window
          marker.addListener('click', () => {
            this.selectedChambre = chambre;
            this.showInfoWindow(marker, chambre);
          });
          
          this.markers.push(marker);
        } catch (error) {
          console.error('Error creating marker:', error);
        }
      }
    });
  }
  
  showInfoWindow(marker: any, chambre: Chambre): void {
    const contentString = `
      <div class="info-window">
        <h3>Chambre ${chambre.numeroChambre}</h3>
        <p><strong>Type:</strong> ${chambre.typeC || 'Non spécifié'}</p>
        <p><strong>Prix:</strong> ${chambre.prix || 0} DT</p>
        <p><strong>Statut:</strong> ${chambre.isAvailable ? 'Disponible' : 'Non disponible'}</p>
        <button id="viewDetailsBtn" class="btn btn-info btn-sm">Voir détails</button>
      </div>
    `;
    
    const infoWindow = new google.maps.InfoWindow({
      content: contentString
    });
    
    infoWindow.open(this.map, marker);
    
    // Handle click on view details button inside info window
    google.maps.event.addListener(infoWindow, 'domready', () => {
      document.getElementById('viewDetailsBtn')?.addEventListener('click', () => {
        console.log('View details for chambre:', chambre);
        // Navigate to details page or show modal
        // Implementation depends on your application's routing
      });
    });
  }
  
  clearMarkers(): void {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];
  }
}
