
# OCTOBULL Special Request System

This is a web application for submitting and managing special item requests for stores, built with React and TypeScript.

## Deployment to GitHub Pages

This project is configured for **automated deployment** using GitHub Actions.

### How It Works

1.  **Push to `main`**: Every time you push a change to the `main` branch, a GitHub Action will automatically start.
2.  **Build**: The action will install all dependencies (`npm install`) and create a production build of your application (`npm run build`).
3.  **Deploy**: The contents of the build folder (`dist`) will be automatically deployed to your GitHub Pages site.

### One-Time Setup on GitHub

You only need to do this once for your repository.

1.  Go to your repository on GitHub.
2.  Click on the **"Settings"** tab.
3.  In the left sidebar, click on **"Pages"**.
4.  Under **"Build and deployment"**, for the **"Source"**, select **"GitHub Actions"**.
5.  Click "Save".

Your site will be live at `https://<your-username>.github.io/OCTOBULL/` a few minutes after your next push to the `main` branch.

### Running Locally

To run the project on your local machine for development:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the Development Server**:
    ```bash
    npm run dev
    ```

This will start a local server, usually at `http://localhost:5173`.
