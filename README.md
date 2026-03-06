# Skycast AI Whisper

## Project Overview

Skycast AI Whisper is a TypeScript-based web application that utilizes advanced speech recognition through OpenAI’s Whisper model to provide an interactive, voice-activated weather forecast experience. Users can retrieve live weather updates and interact with the application through natural language voice commands, streamlining access to meteorological information.

> **Live Demo:** [https://skycast-ai-whisper.vercel.app](https://skycast-ai-whisper.vercel.app)

---

## Project Features

- **Voice-Driven Weather Access**: Get real-time weather forecasts with spoken commands.
- **State-of-the-Art Speech Recognition**: Integrates OpenAI Whisper for robust and accurate audio-to-text conversion.
- **User-Friendly Interface**: Clean and modern UI built with Tailwind CSS and Vite.
- **Cross-Platform**: Runs seamlessly in modern web browsers.
- **Extensible Architecture**: Modular codebase makes it easy to extend or integrate with other services.

---

## How It Works

1. **Speech Capture**: The app listens for user speech via the browser’s microphone API.
2. **Transcription**: Audio is transcribed to text using the Whisper AI model.
3. **Weather Query**: The interpreted user query is matched against weather data sources.
4. **Response**: The app displays and/or reads out current weather details for the requested location.

---

## Project Structure

```
skycast-ai-whisper/
│
├── public/                  # Static assets (images, icons, etc.)
├── src/                     # Source code (components, utilities, app logic)
│   └── ...                  # Subdirectories for features and modules
├── index.html               # Main HTML file
├── package.json             # Project metadata and dependencies
├── tailwind.config.ts       # Tailwind CSS configuration
├── vite.config.ts           # Vite bundler configuration
├── tsconfig*.json           # TypeScript configuration files
├── eslint.config.js         # Linting configuration
├── postcss.config.js        # PostCSS configuration
├── bun.lockb                # Bun package manager lockfile (if used)
└── components.json          # Component configuration (if used)
```

---

## Tech Stack

- **TypeScript**: Main programming language for reliability and maintainability.
- **React** *(if used in src/)*: Frontend framework for UI.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Vite**: Fast build tool and development server.
- **OpenAI Whisper**: Speech-to-text AI model for robust voice recognition.
- **Bun** / **npm**: Package manager and scripts.
- **Browser APIs**: For audio recording and playback.

---

## Setup Instructions

1. **Clone the Repository**
   ```sh
   git clone https://github.com/SamantD7/skycast-ai-whisper.git
   cd skycast-ai-whisper
   ```

2. **Install Dependencies**
   - Using npm:
     ```sh
     npm install
     ```
   - Or with Bun:
     ```sh
     bun install
     ```

3. **(If Required) Configure API Keys**
   - Set up your OpenAI/Whisper credentials as needed in environment variables or config files.

4. **Run the Application in Development**
   ```sh
   npm run dev
   # or
   bun run dev
   ```

5. **Build for Production**
   ```sh
   npm run build
   # or
   bun run build
   ```

6. **Open in Browser**
   - Visit `http://localhost:3000` (or the port shown) to access the app.

---

## Acknowledgements

- [OpenAI Whisper](https://github.com/openai/whisper) – For providing the core speech-to-text capabilities.
- [Vercel](https://vercel.com/) – For hosting the live demo.
- [Tailwind CSS](https://tailwindcss.com/) and [Vite](https://vitejs.dev/) – For making modern web development fast and powerful.
- Inspiration from open source weather and speech processing projects.

---

## Contact

**Maintainer**: SamantD7  
**GitHub**: [https://github.com/SamantD7](https://github.com/SamantD7)

For issues, suggestions, or collaboration, please open an issue or reach out via GitHub.

---
