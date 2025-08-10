
# Blend Track Editor

A modern, web-based two-track video and audio editor built with React, TypeScript, Vite, Tailwind CSS, and shadcn-ui. Easily drag and drop video and audio clips, preview your timeline, and export your creation.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Technologies Used](#technologies-used)
- [UI & Components](#ui--components)
- [Deployment](#deployment)
- [Custom Domain](#custom-domain)
- [License](#license)

---

## Features

- **Two-track timeline:** Drag and drop video and audio clips to build your timeline.
- **Media Library:** Preloaded with sample videos and audios, easily extendable.
- **Resizable Clips:** Adjust the length of clips visually.
- **Playback & Preview:** Play your timeline with synchronized video and audio.
- **Export:** Simulated export with user feedback (ready for backend integration).
- **Modern UI:** Responsive, accessible, and beautiful interface using shadcn-ui and Tailwind CSS.
- **Confetti Celebration:** Fun confetti animation on successful export.

## Demo

![Editor Screenshot](public/placeholder.svg)  
*Replace with actual screenshot or GIF.*

## Project Structure

```
blend-track-editor/
├── public/
│   └── media/
│       ├── audios/
│       └── videos/
├── src/
│   ├── components/
│   │   ├── editor/
│   │   │   ├── MediaLibrary.tsx
│   │   │   ├── Track.tsx
│   │   │   └── VideoEditor.tsx
│   │   └── ui/...
│   ├── pages/
│   │   ├── EditorMode.tsx
│   │   ├── ResultsPage.tsx
│   │   └── ...
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── ...
```

- **`src/components/editor/`**: Core editor logic and UI.
- **`src/pages/`**: App pages (Editor, Results, etc).
- **`public/media/`**: Sample media files.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

```bash
git clone <YOUR_GIT_URL>
cd blend-track-editor
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Scripts

- `npm run dev` – Start the development server.
- `npm run build` – Build for production.
- `npm run preview` – Preview the production build.
- `npm run lint` – Lint the codebase.

## Technologies Used

- **React** & **TypeScript** – UI and logic.
- **Vite** – Fast build tool and dev server.
- **Tailwind CSS** – Utility-first CSS framework.
- **shadcn-ui** – Accessible, beautiful UI components.
- **Radix UI** – Primitives for accessible UI.
- **TanStack React Query** – Data fetching and caching.
- **Lucide Icons** – Icon set.
- **Framer Motion** – Animations.
- **Other**: date-fns, recharts, and more (see `package.json`).

## UI & Components

- **VideoEditor**: Main editor interface.
- **MediaLibrary**: Drag-and-drop media selection.
- **Track**: Timeline for video/audio clips.
- **Sidebar**: Navigation.
- **ResultsPage**: Shows exported video and confetti.

## Deployment

You can deploy this project using [Lovable](https://lovable.dev/) or any static hosting provider (Vercel, Netlify, etc).

### Lovable Deployment

1. Open your project on [Lovable](https://lovable.dev/).
2. Click on **Share → Publish**.

### Custom Domain

To connect a custom domain on Lovable:

- Go to **Project > Settings > Domains** and click **Connect Domain**.
- See the [Lovable docs](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide) for details.

## License

MIT (or specify your license here).

---

**Note:**  
- For backend export functionality, integrate your own server or cloud function.
- You can extend the media library by adding files to `public/media/`.
