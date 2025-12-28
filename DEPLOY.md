# Deployment Guide for FocusFlow

Since FocusFlow is a **static Single Page Application (SPA)** (it runs entirely in the browser and saves data to your computer), it is very easy and free to deploy.

Here are the three best ways to share your app.

---

## Option 1: Vercel (Recommended)
**Best for:** Zero configuration, automatic HTTPS, and fastest setup.

1.  Open your terminal in the project folder.
2.  Run the following command (no installation needed):
    ```bash
    npx vercel
    ```
3.  Follow the prompts:
    -   **Set up and deploy?** [Y]
    -   **Which scope?** [Select your account/Enter]
    -   **Link to existing project?** [N]
    -   **Project Name?** `focus-flow` (or press Enter)
    -   **In which directory?** `./` (Press Enter)
    -   **Want to modify settings?** [N] (Vite settings are auto-detected)
4.  Wait ~30s. It will give you a "Production" URL (e.g., `https://focus-flow.vercel.app`).

---

## Option 2: Netlify Drop
**Best for:** Drag-and-drop simplicity (no terminal required).

1.  Run the build command locally:
    ```bash
    npm run build
    ```
2.  This creates a `dist` folder in your project directory.
3.  Go to [app.netlify.com/drop](https://app.netlify.com/drop).
4.  Drag and drop the `dist` folder onto the page.
5.  Your site is live instantly!

---

## Option 3: GitHub Pages
**Best for:** Hosting alongside your source code.

1.  Open `vite.config.js` and add your repository name as the base:
    ```javascript
    export default defineConfig({
      base: '/focus-flow/', // Replace with your repository name
      plugins: [react()],
    })
    ```
2.  Install the deploy script:
    ```bash
    npm install gh-pages --save-dev
    ```
3.  Add lines to `package.json` scripts:
    ```json
    "scripts": {
      "predeploy": "npm run build",
      "deploy": "gh-pages -d dist",
      ...
    }
    ```
4.  Run `npm run deploy`.
