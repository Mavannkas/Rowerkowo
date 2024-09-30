# 🚴‍♂️ Rowerkowo – Cycling Route Planner

**Rowerkowo** is an innovative cycling route planning app, developed in 24 hours during the **HackYeah** hackathon. The app focuses on improving cycling safety by analyzing various factors such as air pollution, road accidents, and current hazards to suggest the safest and most efficient routes for cyclists.

## Key Features
- **Smart route selection**: Routes are dynamically adjusted based on air quality data (GIOŚ), accident reports (Polish Road Safety Observatory), and current safety hazards (National Safety Threat Map).
- **Three riding modes**: 
  - Normal: Daily rides with a balance of safety and efficiency.
  - Sport: Intense cycling routes optimized for performance.
  - Family: Safe routes designed for family-friendly cycling.
- **Route sharing**: Users can save their favorite routes and share them with the community.
- **Progressive Web App (PWA)**: Works seamlessly across mobile and desktop platforms.

## Technology Stack

### Backend:
- **NestJS**: The backend is built using the NestJS framework, providing a scalable and maintainable architecture.
- **TypeScript**: Ensures a type-safe development environment across the entire codebase.
- **Open Source Routing Machine (OSRM)**: The routing engine, integrated with custom modifications, provides fast and efficient route calculations.
  
### Frontend:
- **Vue.js**: The user interface is built using Vue.js, delivering a responsive and dynamic experience for users.
- **TypeScript**: Ensures a type-safe development environment across the entire codebase.
- **Leaflet**: Integrated with OpenStreetMap to provide interactive map views and route displays.
- **OpenStreetMap (OSM)**: We utilize OSM as the primary source of map data, ensuring up-to-date and open-access geographic information.

## How It Works
Rowerkowo integrates various data sources to calculate optimal routes. It fetches air quality data from GIOŚ, accident statistics from the Polish Road Safety Observatory, and hazard alerts from the National Safety Threat Map. These factors are then processed by the OSRM engine to prioritize safe cycling routes, tailored to user preferences.

