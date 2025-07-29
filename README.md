# Matcha Trading - Electron App

A modern cryptocurrency trading platform built with Electron, Next.js, and Shadcn UI.

## Features

- 🚀 Modern UI inspired by Matcha trading platform
- 💻 Cross-platform desktop application
- 🎨 Beautiful design with Tailwind CSS and Shadcn UI
- 🔍 Search functionality for tokens
- 📊 Real-time token price display
- 🎯 Responsive grid layout for token cards

## Tech Stack

- **Electron** - Desktop app framework
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Shadcn UI** - Component library
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ticketing-app
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the app in development mode:
```bash
npm run electron-dev
```

This will:
- Start the Next.js development server
- Launch Electron when the server is ready
- Enable hot reloading

### Building

Build the app for production:
```bash
npm run build
```

### Packaging

Create distributable packages:
```bash
npm run dist
```

This will create platform-specific installers in the `dist` folder.

## Project Structure

```
ticketing-app/
├── electron/
│   └── main.js          # Electron main process
├── src/
│   ├── app/
│   │   ├── globals.css  # Global styles
│   │   └── page.tsx     # Home page component
│   └── components/
│       └── ui/          # Shadcn UI components
├── public/              # Static assets
├── package.json         # Dependencies and scripts
├── next.config.js       # Next.js configuration
└── electron-builder.json # Electron builder config
```

## Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build Next.js app
- `npm run start` - Start Next.js production server
- `npm run lint` - Run ESLint
- `npm run electron` - Run Electron app (requires built app)
- `npm run electron-dev` - Run Electron in development mode
- `npm run electron-pack` - Build and package the app
- `npm run dist` - Create distributable packages

## Design Features

- **Header**: Clean navigation with search bar and user controls
- **Hero Section**: Prominent call-to-action with wallet integration
- **Token Grid**: Interactive cards displaying cryptocurrency information
- **Responsive Design**: Works on different screen sizes
- **Modern UI**: Rounded corners, subtle shadows, and smooth transitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
