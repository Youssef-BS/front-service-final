// Type definitions for Google Maps JavaScript API
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      setMapTypeId(mapTypeId: string): void;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map: Map, anchor?: MVCObject): void;
      close(): void;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
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
      icon?: string | Icon;
      animation?: any;
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

    interface Icon {
      url: string;
      size?: Size;
      scaledSize?: Size;
      origin?: Point;
      anchor?: Point;
    }

    class Size {
      constructor(width: number, height: number);
    }

    class Point {
      constructor(x: number, y: number);
    }

    class MVCObject {}

    class MVCArray<T> extends MVCObject {
      constructor(array?: T[]);
      getLength(): number;
      getAt(i: number): T;
      setAt(i: number, elem: T): void;
      push(elem: T): number;
    }

    interface MapsEventListener {
      remove(): void;
    }

    namespace event {
      function addListener(instance: any, eventName: string, handler: Function): MapsEventListener;
      function addDomListener(instance: any, eventName: string, handler: Function): MapsEventListener;
      function addListenerOnce(instance: any, eventName: string, handler: Function): MapsEventListener;
      function clearInstanceListeners(instance: any): void;
      function clearListeners(instance: any, eventName: string): void;
      function trigger(instance: any, eventName: string, ...args: any[]): void;
    }

    namespace Animation {
      const DROP: any;
      const BOUNCE: any;
    }

    namespace MapTypeId {
      const ROADMAP: string;
      const SATELLITE: string;
      const HYBRID: string;
      const TERRAIN: string;
    }

    namespace MapTypeControlStyle {
      const HORIZONTAL_BAR: number;
      const DROPDOWN_MENU: number;
      const DEFAULT: number;
    }
  }
} 