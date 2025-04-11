# Location Search

A modern web application built with Next.js that allows users to search and visualize locations on an interactive map. The application features automatic location detection, predictive search, and a clean, responsive interface.

## Features

- 🔍 **Predictive Search**: Real-time location suggestions as you type
- 🗺️ **Interactive Map**: Visual representation of searched locations
- 📍 **Automatic Location Detection**: Automatically centers the map on the user's location
- ⚡ **Debounced Search**: Optimized search performance with debouncing
- 🎨 **Modern UI**: Built with Shadcn UI components for a polished look
- 🌓 **Dark Mode Support**: Automatically adapts to system preferences

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Maps**: Pigeon Maps
- **Geocoding**: OpenStreetMap Nominatim
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pnvdev/location-search.git
   cd location-search
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Location Detection**:
   - The application automatically detects the user's location using server-side IP geolocation
   - Falls back to a default location if detection fails

2. **Search Functionality**:
   - Type in the search box to get real-time location suggestions
   - Click on a suggestion or press Enter to center the map on the selected location
   - The map updates instantly with a marker at the selected location

3. **Map Interaction**:
   - Interactive map with zoom and pan controls
   - Marker indicates the current selected location
   - Smooth transitions when moving between locations

## Development

### Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── actions.ts       # Server actions
│   └── page.tsx         # Main page component
├── components/          # React components
│   ├── MapSearch.tsx    # Main map and search component
│   └── ui/             # Shadcn UI components
└── lib/                # Utility functions
```

### Environment Variables

No environment variables are required for development. The application uses free services for all functionality.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
