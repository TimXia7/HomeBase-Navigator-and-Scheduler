# HomeBase — Navigator & Scheduler

HomeBase is a full-stack productivity web application designed to combine task management, scheduling, and map-based planning into one customizable workspace.

The goal of the project is to help users organize tasks not only by priority or category, but also by **location** and **time constraints**. Instead of managing a to-do list, schedule, and map separately, HomeBase aims to bring these workflows together so users can plan what they need to do, where they need to go, and when tasks should happen.

## Current Features

- Interactive map for selecting task locations
- Reverse geocoding using OpenStreetMap/Nominatim
- React-based frontend for task planning and navigation
- Spring Boot backend setup for future API and persistence features
- Early full-stack architecture designed for future database and external API integration

## Planned Features

- Task scheduling with time constraints
- Persistent task storage
- Route and travel-time-aware planning
- User accounts and saved workspaces
- Custom task boards and daily planning views
- Deployment to a dedicated domain as a free-to-use application

## Tech Stack

### Frontend
- React
- JavaScript
- HTML
- CSS

### Backend
- Java
- Spring Boot
- Maven

### APIs / Mapping
- OpenStreetMap
- Nominatim reverse geocoding

## Running the Project Locally

### Start the Spring Boot Backend

```bash
cd backend/scheduler
mvn spring-boot:run
```

### Start the Spring Boot Frontend
```bash
cd frontend
npm start
```

### Example: Selecting a Task Location
The map interface allows users to select a location, which can then be associated with a task.

<img width="2546" height="1223" alt="Selecting a location on the interactive map" src="https://github.com/user-attachments/assets/8e7e260b-1c86-41c8-a5aa-3650dea095f2" /> 
