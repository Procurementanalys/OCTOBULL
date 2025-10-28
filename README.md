
# OCTOBULL Special Request System

This is a web application for submitting and managing special item requests for stores, built with React and TypeScript.

## Project Setup and Deployment Guide

This guide will walk you through setting up the project on your local machine, building it for production, and deploying it to GitHub Pages.

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

When you are ready to deploy your application, you need to create a production-ready build. This will bundle all your code into optimized static files (HTML, CSS, JavaScript) inside a `dist` folder.

```bash
npm run build
```

After running this command, you will find a new `dist` directory in your project. This is the folder you will deploy.

### 4. Deploying to GitHub Pages

Follow these steps to host your application on GitHub Pages for free.

**Step A: Create a GitHub Repository**

If you haven't already, create a new repository on [GitHub](https://github.com/new) and push your project code to it.

**Step B: Configure `vite.config.ts`**

Open the `vite.config.ts` file. You **must** set the `base` option to your repository name. For example, if your GitHub repository URL is `https://github.com/your-username/octobull-app`, you must change the file to:

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

**Step C: Deploy!**

Now, you can deploy your application by running a single command. This command will first build your project and then push the contents of the `dist` folder to a special `gh-pages` branch on your repository.

```bash
npm run deploy
```

**Step D: Configure GitHub Repository Settings**

1.  Go to your repository on GitHub.
2.  Click on the "Settings" tab.
3.  In the left sidebar, click on "Pages".
4.  Under "Build and deployment", for the "Source", select "Deploy from a branch".
5.  Set the branch to `gh-pages` and the folder to `/ (root)`.
6.  Click "Save".

Your site should be live at `https://<your-username>.github.io/<your-repo-name>/` within a few minutes.
