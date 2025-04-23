// Type definitions for Google Maps JavaScript API
// Simplified type declarations for our component

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      addListener(event: string, handler: Function): any;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map: Map, marker?: Marker): void;
    }

    interface MapOptions {
      center: LatLng | LatLngLiteral;
      zoom: number;
      mapTypeId?: string;
      mapTypeControl?: boolean;
      mapTypeControlOptions?: any;
      scaleControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      animation?: any;
      icon?: string | Icon;
    }

    interface Icon {
      url: string;
      size?: Size;
      scaledSize?: Size;
      origin?: Point;
      anchor?: Point;
    }

    interface InfoWindowOptions {
      content?: string | Node;
      position?: LatLng | LatLngLiteral;
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface Size {
      width: number;
      height: number;
    }

    interface Point {
      x: number;
      y: number;
    }

    const MapTypeId: {
      ROADMAP: string;
      SATELLITE: string;
      HYBRID: string;
      TERRAIN: string;
    };

    const Animation: {
      DROP: number;
      BOUNCE: number;
    };

    const MapTypeControlStyle: {
      HORIZONTAL_BAR: number;
      DROPDOWN_MENU: number;
      DEFAULT: number;
    };

    namespace event {
      function addListener(instance: any, eventName: string, handler: Function): any;
    }
  }
} 