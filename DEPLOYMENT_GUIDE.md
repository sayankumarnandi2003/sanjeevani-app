# 🚀 Deployment Guide: Sanjeevani App

This guide will help you deploy your React application to **Netlify** and ensure your sensitive API keys remain secure.

## 🔒 Step 1: Securing Your Environment Variables

You asked how to secure your `.env` file. Here is the golden rule:
**NEVER commit your `.env` file to GitHub.**

### How we ensured this:
1.  We have a `.gitignore` file in your project root.
2.  This file contains a line saying `.env`.
3.  This tells Git to completely ignore your local secrets file.
4.  **Verification**: You can check your GitHub repository. You will see that the `.env` file is NOT there. This is exactly what we want.

---

## 🌐 Step 2: Deploying to Netlify

Since your code is already on GitHub, connecting to Netlify is easy.

1.  **Log in to Netlify**: Go to [app.netlify.com](https://app.netlify.com) and log in.
2.  **Add New Site**:
    *   Click the **"Add new site"** button (usually teal colored).
    *   Select **"Import from an existing project"**.
3.  **Connect to Git**:
    *   Choose **GitHub** as your provider.
    *   Authorize Netlify if asked.
    *   Search for and select your repository: `sanjeevani-app`.
4.  **Configure Build Settings**:
    *   Netlify usually detects these automatically for Vite/React apps.
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `dist`
    *   *Leave the rest as default.*

---

## 🔑 Step 3: Adding Environment Variables on Netlify

Since we didn't upload the `.env` file (for security), we need to tell Netlify about your API key manually.

1.  On the deployment setup screen (or in "Site Settings" after deploying), look for **"Environment variables"**.
2.  Click **"Add a variable"**.
3.  **Key**: `VITE_GEMINI_API_KEY`
4.  **Value**: Paste your actual Gemini API Key here (the one starting with `AIza...`).
5.  Click **"Create"** or **"Save"**.

> **Note**: If you add the variable *after* the deployment has started, you will need to go to the **"Deploys"** tab and click **"Trigger deploy"** -> **"Clear cache and deploy site"** for the changes to take effect.

## ✅ Step 4: Finalize

1.  Click **"Deploy site"**.
2.  Wait for a minute or two. Netlify will build your app.
3.  Once the link turns green (e.g., `https://random-name-12345.netlify.app`), click it!
4.  **Test it**: Try chatting with the AI to make sure the API key is working.

---

## 🎉 Done!
Your app is now live and secure. You can share the link with anyone.
