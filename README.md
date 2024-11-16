# Spotify to Apple Music Transfer

A modern web application built with React and TypeScript that enables users to seamlessly manage and transfer their music libraries between Spotify and Apple Music. Featuring a beautiful, responsive UI that adapts to each platform's design language, robust authentication handling, and comprehensive music library management capabilities.

## ✨ Features

### 🎵 Platform Integration
- **Spotify Integration**
  - OAuth-based authentication
  - Access to playlists, liked songs, and user profile
  - Comprehensive playlist management
  - Metadata export functionality

- **Apple Music Integration**
  - MusicKit JS integration
  - Library access and playlist management
  - Native platform design aesthetics

### 🎨 User Interface
- Seamless platform switching with animated transitions
- Responsive design optimized for all devices
- Platform-specific styling that matches each service's design language
- Infinite scroll for large music libraries

### 📊 Library Management
- Create and manage playlists
- Search and filter functionality
- Sort by various criteria (name, tracks, artists, albums)
- Batch operations support

### 💾 Data Export
- Export playlist metadata to CSV
- Download track information in JSON format
- Comprehensive metadata fields support

## 🚀 Getting Started

### Prerequisites

1. Node.js (v16 or higher)
2. Spotify Developer Account
3. Apple Developer Account with MusicKit access
4. Modern web browser

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_REDIRECT_URI=your_redirect_uri
VITE_API_URL=your_api_url
```

### Installation

```bash
# Clone the repository
git clone https://github.com/elmelz6472/spotify-apple-music-transfer.git

# Navigate to project directory
cd spotify-apple-music-transfer

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── animations/      # Transition and animation components
│   ├── appleMusic/     # Apple Music specific components
│   ├── header/         # Header components for different views
│   ├── layout/         # Layout components
│   ├── navigation/     # Navigation components
│   ├── playlists/      # Playlist related components
│   ├── search/         # Search components
│   ├── spotify/        # Spotify specific components
│   └── tracks/         # Track related components
├── hooks/              # Custom React hooks
├── interfaces/         # TypeScript interfaces
├── enums/             # TypeScript enums
├── fetch/             # API fetch utilities
├── icons/             # Custom icon components
├── App.tsx            # Main application component
└── config.ts          # Application configuration
```

## 🛠️ Tech Stack

### Core Technologies
- React 18
- TypeScript
- Vite
- React Router v6
- TanStack Query (React Query)
- Framer Motion
- Tailwind CSS

### API Integration
- Spotify Web API
- Apple Music API (MusicKit JS)
- Axios

### UI Components
- Lucide React Icons
- Recharts
- Shadcn/ui

## 📱 Features Deep Dive

### Authentication Flow
- **Spotify**: OAuth 2.0 with automatic token refresh
- **Apple Music**: MusicKit JS authorization with developer token

### Platform Switching
```typescript
const { mode, isTransitioning, toggleMode } = useAppMode();
```
Seamless transition between platforms with animation support and state persistence.

### Playlist Management
```typescript
const {
    selectedTracks,
    isSaving,
    playlistName,
    createPlaylist
} = usePlaylistCreation(token);
```
Comprehensive playlist creation and management with metadata support.

### Search and Filter
```typescript
const {
    searchResults,
    isSearching,
    searchTerm,
    setSearchTerm
} = useTrackSearch(token);
```
Real-time search with debouncing and efficient cache management.

## 🔧 Development

### Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck
```

### Adding New Features
1. Create necessary interfaces in `/interfaces`
2. Add required API methods in `/fetch`
3. Create new components in appropriate directories
4. Update relevant hooks in `/hooks`
5. Add routes if needed in `App.tsx`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api/)
- [Apple Music API Documentation](https://developer.apple.com/documentation/applemusicapi/)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📫 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/elmelz6472/spotify-apple-music-transfer](https://github.com/elmelz6472/spotify-apple-music-transfer)
