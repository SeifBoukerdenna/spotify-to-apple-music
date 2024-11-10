# Music Metadata Manager

A web application that allows users to connect to their Spotify and Apple Music accounts, view their playlists and liked songs, and download metadata for their music. The app provides a unified platform to manage and export music metadata across both streaming services.

## Table of Contents

- [Introduction](#introduction)
- [Goals](#goals)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)


## Introduction

Music Metadata Manager is a web application designed to help users seamlessly interact with their music libraries on Spotify and Apple Music. By providing an intuitive interface, users can view their playlists and liked songs, download metadata in universally accepted formats, and switch between platforms with ease.


## Goals

- **Unified Music Management**: Offer a single platform for users to access and manage their music across Spotify and Apple Music.
- **Metadata Export**: Enable users to download music metadata with universally accepted fields for use on other platforms or personal analysis.
- **User-Friendly Interface**: Provide an intuitive and responsive UI that reflects the design language of each platform.
- **Platform Switching**: Allow users to toggle between Spotify and Apple Music modes seamlessly.

## Features

### Spotify Mode
- **Authentication**: Log in with Spotify credentials using OAuth.
- **User Profile**: Display user information fetched from Spotify.
- **Playlists and Liked Songs**:
  - View all user playlists and liked songs.
  - Search, sort, and filter playlists and tracks.
- **Metadata Download**:
  - Download playlist metadata in CSV format.
  - Download individual track metadata in JSON format.
  - Metadata includes universally accepted fields: song title, artist, album, and release year.

### Apple Music Mode
- **Authentication**: Connect to Apple Music using MusicKit JS.
- **User Playlists**:
  - View user playlists with artwork and descriptions.
- **Platform-Specific Styling**:
  - The app's UI adapts to reflect Apple Music's design aesthetics.

### General Features
- **Mode Toggle**: Switch between Spotify and Apple Music modes at any time.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Error Handling**: Inform users of any issues during authentication or data fetching.

## Tech Stack

### Front-end:
- **React with TypeScript**: For building the user interface.
- **React Router**: For client-side routing.
- **Axios**: For making HTTP requests.
- **FileSaver**: For downloading files.
- **json2csv**: For converting JSON data to CSV.

### APIs and Libraries:
- **Spotify Web API**: For interacting with Spotify data.
- **Apple Music API**: For interacting with Apple Music data.
- **MusicKit JS**: For Apple Music integration.

### Styling:
- **CSS**: With platform-specific styles to mimic Spotify and Apple Music interfaces.

### Build Tools:
- **Webpack**: For module bundling (if applicable).
- **Babel**: For JavaScript transpiling (if applicable).


## Getting Started

To get started with the Music Metadata Manager, follow these steps:

### Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js and npm**: Make sure you have Node.js and npm installed on your machine. You can download them from [nodejs.org](https://nodejs.org/).

- **Spotify Developer Account**:
  - Register an application on the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications) to obtain a Client ID and Client Secret.

- **Apple Developer Account**:
  - Enable Apple Music API and MusicKit capabilities in your Apple Developer account.
  - Generate a Developer Token and obtain your Team ID, Key ID, and private key (.p8 file).

## Installation

Follow these steps to install the application:

1. **Clone the repository**:
   ```sh
   git clone https://github.com/yourusername/spotify-to-apple-music.git
   cd spotify-to-apple-music
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   APPLE_TEAM_ID=your_apple_team_id
   APPLE_KEY_ID=your_apple_key_id
   APPLE_PRIVATE_KEY=your_apple_private_key
   ```

## Running the Application

To run the application locally, use the following command:
```sh
npm start
```

This will start the development server and open the application in your default web browser.

## Project Structure

The project structure is as follows:
```
spotify-to-apple-music/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── App.tsx
│   ├── index.tsx
│   └── ...
├── .env
├── package.json
└── README.md
```

## Future Improvements

- **Enhanced Metadata Fields**: Add more metadata fields such as genre, duration, and popularity.
- **Playlist Transfer**: Implement functionality to transfer playlists between Spotify and Apple Music.
- **User Preferences**: Allow users to save and manage their preferences within the app.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.