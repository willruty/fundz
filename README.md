# Fundz

## Overview
Fundz is a personal project aimed at building a **modern and centralized financial organization platform**, focused on simplicity, clarity, and a serious approach to personal finance management.

The project is currently in an **early development stage** and is being redesigned to better reflect backend best practices and scalable architecture.

## Problem
Managing personal finances often involves multiple tools with poor usability, fragmented data, or overly complex interfaces.  
Fundz aims to centralize financial information into a **clean, intuitive, and structured interface**, making financial organization more accessible without sacrificing control or seriousness.

## Solution
The platform is designed as a web application with a modern frontend and a backend responsible for authentication, data persistence, and business rules.

The current implementation includes the initial authentication flow, and the project is planned to evolve into a full backend-driven system with well-defined APIs and domain logic.

## Main Features
(Current and planned)

- User authentication (initial implementation)
- Centralized financial data visualization
- Categorization of expenses and income
- Backend-driven business rules
- Secure data persistence

## Tech Stack
- **Frontend:** React, Tailwind CSS  
- **Backend:** Go (current) → Java (planned migration)  
- **Database:** PostgreSQL  
- **Authentication:** JWT  
- **Infrastructure:** Local development environment

## Architecture
The project follows a classic client-server architecture:
- A React frontend responsible for user interaction
- A backend API handling authentication, business rules, and data persistence
- A relational database storing user and financial data

The backend is currently being rethought to migrate from Go to **Java**, with the goal of improving maintainability, structure, and long-term scalability.

## How to Run
> ⚠️ The project is currently incomplete and not production-ready.

Basic setup instructions will be added as the backend refactor progresses.

## Key Technical Decisions
- Initial backend written in Go for rapid prototyping
- Planned migration to Java to better structure domain logic and long-term growth
- Focus on backend-first design rather than UI-driven development
- Prioritization of clean architecture over rapid feature delivery

## Status
🚧 **Early-stage / paused**

The project was started as an experimental personal initiative and paused in its initial phase.  
It is planned to be **resumed and refactored**, with the backend being rewritten in Java and the project scope better defined.

## Next Steps
- Redesign backend architecture in Java
- Define core financial domain entities
- Implement secure authentication and authorization
- Expand backend APIs and business rules
