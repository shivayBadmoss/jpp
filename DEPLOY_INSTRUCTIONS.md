# Deployment Instructions for Railway

This guide will help you deploy your full-stack JPrint application (Vite + Express + PostgreSQL) to Railway.app.

## Prerequisites

1.  **GitHub Repository**: Ensure this project is pushed to a GitHub repository.
2.  **Railway Account**: Sign up at [railway.app](https://railway.app/).

## Step 1: Prepare the Repository

Your project is already configured for deployment.

- **Frontend Build**: The `build` script automatically generates the Prisma client and builds the Vite frontend.
- **Server**: The existing `npm start` command runs the Express server, which serves the built frontend files.
- **Database**: The code is set up to use a standard PostgreSQL connection.

## Step 2: Create Project on Railway

1.  Go to your Railway Dashboard and click **"New Project"**.
2.  Select **"Deploy from GitHub repo"**.
3.  Choose your repository.
4.  **Important**: If your project is inside a subdirectory (like `jpp`), you must configure the "Root Directory" in Railway settings later. (If `jpp` is the root of your repo, skip this).

## Step 3: Add a Database

1.  In your Railway project view, right-click (or click "New") to add a service.
2.  Select **Database** -> **PostgreSQL**.
3.  Railway will provision a database.

## Step 4: Configure the Web Service

1.  Click on your application service (the one connected to GitHub).
2.  Go to **Variables**.
3.  Add the following variables:
    - `DATABASE_URL`: `${{Postgres.DATABASE_URL}}` (Railway assumes this syntax or you can manually copy the connection string from the Postgres service "Connect" tab).
    - `NODE_ENV`: `production` (Optional, but recommended).
    - `PORT`: Railway automatically sets this (usually 80 or similar), no need to add it manually unless you want a specific internal port, but let Railway handle it.

## Step 5: Configure Build & Start (If not auto-detected)

Railway usually detects the `package.json` scripts automatically.

- **Build Command**: `npm run build`
- **Start Command**: `npm start`

If you need to verify:

1.  Go to **Settings** -> **Build**.
2.  Ensure the **Root Directory** is correct (e.g., `/jpp` if your repo has the folder, or `/` if `jpp` contents are at the root).

## Step 6: Deploy

1.  Once variables are set, Railway might trigger a redeploy or you can manually click **"Deploy"**.
2.  Watch the "Deploy Logs" to ensure `vite build` runs successfully and Prisma generates the client.
3.  Once deployed, Railway will provide a public URL (e.g., `https://web-production-xxxx.up.railway.app`).

## Troubleshooting

- **Database Connection**: If the app fails to start with database errors, verify `DATABASE_URL` matches the Postgres service URL.
- **Static Files**: If the frontend doesn't load, check the logs for "Static Assets MISSING". This means `npm run build` failed or didn't run.
