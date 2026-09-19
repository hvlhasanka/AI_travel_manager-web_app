# AI Travel Manager Web App - Client

## 1. Description

This is the frontend portion of the AI Travel Manager Web App. It is a React.js application created with Vite, using TypeScript and Tailwind CSS for styling. It handles user interaction, state management, image uploads (Cloudinary), PDF/Excel exports, AI-powered generation (text and images), and provides mobile responsive UI for seamless communication with the backend API.

## 2. Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)

## 3. Installation

Navigate to the `client` directory and install the dependencies:

```bash
cd Workspace/client
npm install
```

Set up your environment variables by copying the example file:

```bash
cp .env.example .env
```

### Start the Application

Once dependencies are installed and the backend server is running, start the development server:

```bash
npm run dev
```

## 4. Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode using Vite. Open [http://localhost:5173](http://localhost:5173) to view it in your browser. The page will reload when you make changes.

### `npm run build`

Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint`

Runs lint to check for code quality and syntax issues.

### `npm run format`

Runs Prettier to automatically format your code according to the `.prettierrc` configuration.

### `npm run preview`

Locally preview the production build after running `npm run build`.

## 5. Source Code Structure

The `src` directory contains the core frontend application code, structured as follows:

- **`main.tsx`**: The main entry point of the React application that renders `App.tsx` into the DOM.
- **`App.tsx`**: The main React component that acts as the root of the application, managing layouts and rendering other components.
- **`global.css`**: The global CSS file where Tailwind CSS directives and custom global styles are imported.
- **`constants.ts`**: Contains constants used across the application.
- **`components/`**: Contains reusable React UI components that make up the different parts of the application.
- **`services/`**: Contains API service functions for communicating with the backend server.
- **`types/`**: Contains TypeScript type definitions and interfaces used throughout the application to ensure type safety.
