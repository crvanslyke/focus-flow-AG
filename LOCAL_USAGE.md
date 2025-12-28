# How to Run FocusFlow Locally 🏠

If you want to use FocusFlow as your daily driver without deploying to the cloud, use this guide.

## Option 1: Development Mode (Easiest)
Use this if you might change the code later.

1.  Open your terminal in the project folder.
2.  Run:
    ```bash
    npm run dev
    ```
3.  Click the link shown (usually `http://localhost:5173`).
4.  **Keep the terminal window open** while using the app.

## Option 2: Production Preview (Faster/Cleaner)
Use this for a more "app-like" experience.

1.  Build the app once:
    ```bash
    npm run build
    ```
2.  Run the preview server:
    ```bash
    npm run preview
    ```
3.  Go to `http://localhost:4173`.
4.  Tip: You can bookmark this URL.

## "Installing" as an App
You can make it feel like a real native app:

1.  Open the local URL in **Chrome** or **Edge**.
2.  Go to **Menu (⋮)** > **Save and Share** > **Install FocusFlow...** (or "Create Shortcut").
3.  Check "Open as window".
4.  Now FocusFlow will have its own icon in your Dock and launch in a standalone window!
