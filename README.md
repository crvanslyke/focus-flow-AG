# FocusFlow 🧠

FocusFlow is a premium, glassmorphic time-blocking application designed for deep work. It helps you visualize your day, manage tasks, and track progress using an intuitive drag-and-drop interface.

## Features

-   **Interactive Calendar**: A 3-day view grid (6 AM - 9 PM) with drag-and-drop scheduling.
-   **Smart Layout**: Automatic handling of overlapping events so nothing is hidden.
-   **Drag-to-Create**: Click and drag on empty slots to instantly create new blocks.
-   **Block Operations**:
    -   **Resize**: Drag the bottom edge to change duration.
    -   **Edit**: Click to update details.
    -   **Delete**: Remove unwanted blocks.
-   **Persistence**: Automatically saves your schedule to your browser's Local Storage.

## Tech Stack

-   **Framework**: React + Vite
-   **Styling**: Vanilla CSS (Variables & Flex/Grid)
-   **Icons**: Lucide React
-   **DnD**: @dnd-kit

## Data & Authentication (Important!)

**FocusFlow is a "Local-First" Application.**

-   **No Login Required**: There is no sign-up or password. You are authenticated by simply being on your device.
-   **Data Location**: All your data is stored securely in your browser's **Local Storage** (`localStorage`).
-   **Privacy**: Your schedule never leaves your device. It is not sent to any server.

### What this means for Deployment
If you deploy this app to Vercel, Netlify, or GitHub Pages:
1.  **Everyone sees their own version**: If you share the link with a friend, they will see a *blank* calendar (because their browser has no data yet). They will not see your schedule.
2.  **Synced only per device**: Adding a block on your laptop will *not* show up on your phone, because the data lives in the browser, not the cloud.

## Development

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start local server**:
    ```bash
    npm run dev
    ```
3.  **Build for production**:
    ```bash
    npm run build
    ```

## Deployment

See [DEPLOY.md](./DEPLOY.md) for instructions on how to deploy to Vercel, Netlify, or GitHub Pages.
