# Comic Collector App

Welcome to the **Comic Collector App**, an application designed for comic book enthusiasts to easily manage and organize their comic book collection. This app allows users to browse comics, save them to collections, and even assign comics to custom libraries for better organization.

The project is split into two main parts:

1. **Frontend** - Built with React, this handles the user interface and interaction with the Comic Collector App.
2. **Backend** - Developed with Express, this manages the API, handles authentication, and connects to the database.

## Table of Contents

- [Comic Collector App](#comic-collector-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Technologies Used](#technologies-used)
    - [Frontend](#frontend-1)
    - [Backend](#backend-1)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Check out the live app](#check-out-the-live-app)
    - [View the Code](#view-the-code)

## Features

### Frontend
- **Comic Search**: Users can search for comics using a search bar and view details like title, issue number, and cover image.
- **Collections**: Users can add comics to their collection and organize them into custom libraries.
- **Library Management**: Users can create and delete libraries to categorize their comic collections.
- **Comic Details**: Users can view additional details about each comic, including publisher info and description.
- **Responsive UI**: The app is built to be mobile-friendly, adapting to different screen sizes.

### Backend
- **User Authentication**: Secure login and registration using JWT tokens and password hashing with bcrypt.
- **Comic Data Management**: API endpoints for managing comics, collections, and libraries.
- **Error Handling**: Robust error handling for failed API calls and authentication errors.
- **Security**: User data is protected with JWT, and sensitive information like passwords is hashed with bcrypt.

## Technologies Used

### Frontend
- **React**: Core framework for building the user interface.
- **Axios**: For making HTTP requests to the backend API.
- **React Router**: Used for navigation and handling page routes.
- **React Icons**: A library for incorporating icons like edit, delete, and add.
- **Jest & Testing Library**: For running unit tests on React components.

### Backend
- **Node.js & Express**: Used for building the RESTful API that serves the frontend.
- **Supabase**: Acts as the backend database to manage user data and comic collections.
- **JWT (jsonwebtoken)**: Used for creating secure tokens for user authentication.
- **bcrypt**: Handles secure password hashing.
- **Jest & Supertest**: For testing the backend API endpoints.

## Installation

### Prerequisites
- Node.js (v14 or higher)
- NPM or Yarn package manager
- Supabase account and project for the database

### Check out the live app
[Live App](https://comic-collector-app.onrender.com/)

### View the Code

1. Clone the backend repository:
   ```bash
   git clone https://github.com/yanmarkb/backend-comic-collector-app.git
   ```

2. Clone the frontend repository:
   ```bash
   git clone https://github.com/yanmarkb/comic-collector-app
    ```
Future Improvements
There are a few things I’d like to add to make this project even better:

Pagination: Add pagination for the comic collection view to handle large collections.
Sorting and Filtering: Allow users to sort comics by title, issue number, and other criteria.
Enhanced Search: Improve the search functionality by including filters like genre or publisher.
User Profiles: Expand the profile section to allow for custom avatars and user preferences.
Social Sharing: Let users share their comic collections on social media or with friends.
Conclusion
I’m really proud of how this app came together because it combines my passion for software engineering with my love for comics. I built this app to create an easy-to-use solution for managing comic collections, but it’s also a project that’s close to my heart. There's a lot of room for growth and new features, and I’m excited to see where it can go from here.