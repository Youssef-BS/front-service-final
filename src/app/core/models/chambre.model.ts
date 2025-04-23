export interface Chambre {
  idChambre?: number;
  numeroChambre: number;
  typeC?: string;
  averageRating?: number;
  totalRatings?: number;
  image?: string;
  prix?: number;
  bloc?: { idBloc: number; nomBloc: string; };
  isAvailable?: boolean;
  location?: {
    lat: number;
    lng: number;
  };
} 