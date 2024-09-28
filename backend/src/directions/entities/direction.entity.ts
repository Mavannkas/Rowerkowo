export type Direction = {
    code: string;
    routes: Route[];
    waypoints: Waypoint[];
  }
  
  export type Waypoint = {
    hint: string;
    distance: number;
    name: string;
    location: number[];
  }
  
  export type Route = {
    geometry: string;
    legs: Leg[];
    distance: number;
    duration: number;
    summary: string;
    weight: number;
  }
  
  export type Leg = {
    steps: any[];
    distance: number;
    duration: number;
    summary: string;
    weight: number;
  }


export type RoutingMode = 'default' | 'sport' | 'family';