# OCTOBULL Special Request System

This is a web application for submitting and managing special item requests for stores, built with React and TypeScript.

## Project Setup and Deployment Guide

This guide will walk you through setting up the project on your local machine and deploying it to GitHub Pages.

### Prerequisites

-   **Node.js**: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/). `npm` (Node Package Manager) is included with Node.js.

### 1. Local Setup

First, you need to install the project's dependencies. Open your terminal, navigate to the project directory, and run:

```bash
npm install
```

### 2. Running the Project Locally

To start the development server and view the application in your browser:

```bash
npm run dev
```

This will start a local server, usually at `http://localhost:5173`. You can open this URL in your browser to see the app.

### 3. Building for Production

To create a production-ready build, which bundles all code into optimized static files inside a `dist` folder, run:

```bash
npm run build
```
This step is handled automatically by the deployment workflow, but you can run it locally to test the build process.

### 4. Deploying to GitHub Pages (Automated)

This project is configured for automated deployment to GitHub Pages using GitHub Actions.

**Step A: Configure `vite.config.ts` (CRITICAL)**

Before your first deployment, you **must** set the `base` option in the `vite.config.ts` file to your repository name. This is a one-time setup.

For example, if your GitHub repository URL is `https://github.com/your-username/octobull-app`, you must change the file to:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Change 'octobull-app' to your repository's name
  base: '/octobull-app/', 
})
```

**Step B: Push to GitHub**

That's it! Simply commit and push your code to the `main` branch of your GitHub repository:

```bash
git push origin main
```

The GitHub Actions workflow will automatically trigger. It will build your application and deploy it.

**Step C: Configure GitHub Repository Settings (One-Time Setup)**

1.  Go to your repository on GitHub.
2.  Click on the "Settings" tab.
3.  In the left sidebar, click on "Pages".
4.  Under "Build and deployment", for the "Source", select **"GitHub Actions"**.

Your site will become available at `https://<your-username>.github.io/<your-repo-name>/` after the first successful workflow run. You can monitor the progress in the "Actions" tab of your repository.
