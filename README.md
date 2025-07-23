
# NutriLife AI 🥗✨

NutriLife AI is your personal health assistant, designed to help you make smarter choices about the food and lifestyle products you use every day. Powered by the Google Gemini API, this app provides instant, data-driven insights to empower your wellness journey.

## Features

*   🔐 **Cross-Device Accounts:** Sign up and log in from any device. Your data is securely stored in the cloud with Firebase.
*   🔬 **Product Analyzer:** Not sure if a product is healthy? Snap a picture of its label or just type in the name. You'll get an instant health score (A-F), a detailed ingredient analysis, and suggestions for healthier alternatives.
*   🌿 **Lifestyle Overhaul:** Want a bigger picture? List your regular daily products and receive a complete, prioritized action plan to improve your habits, complete with smart swaps.
*   ✨ **Personalized Recommendations:** Get AI-powered suggestions for new products you might love, based on your previous analyses.
*   📚 **Cloud-Synced History:** Every analysis is automatically saved to your account. Revisit your past reports anytime, from any device.

## Firebase Backend Setup

This application uses Firebase for authentication and as a database. To run it, you must first set up your own Firebase project. It's a bit of work, but you only have to do it once!

### Step 1: Create a Firebase Project

### Step 2: Register Your Web App

### Step 3: Enable Authentication Methods

### Step 4: Set Up Firestore Database

### Step 5: Configure Firestore Security Rules
1.  In Firestore, go to the **"Rules"** tab.
2.  Replace the default rules with the following to ensure users can only access their own data. This is important!
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Users can only read and write to their own document.
        match /users/{userId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
    ```
3.  Click **"Publish"**.

---

## Vercel Deployment Guide

Deploying this app to Vercel is the recommended way to get it online.

### Step 1: Import Your Project

### Step 2: Configure Build & Output Settings
Vercel should automatically detect that this is a **Vite** project and configure the settings for you. If you need to check or enter them manually, use the following:

- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 3: Add Environment Variables
This is the most important step for connecting to Firebase and Google AI.
1. In your new Vercel project's dashboard, click on the **"Settings"** tab.
2. Choose **"Environment Variables"** from the menu on the left.
3. Add the **seven** required variables one by one. The `KEY` must match exactly. The `VALUE` comes from your Firebase project config and Google AI Studio.

| Key                                     | Value                                      |
| :-------------------------------------- | :----------------------------------------- |
| `API_KEY`                               | `your-google-ai-api-key-goes-here`         |
| `VITE_FIREBASE_API_KEY`                 | `your-firebase-api-key`                    |
| `VITE_FIREBASE_AUTH_DOMAIN`             | `your-firebase-auth-domain`                |
| `VITE_FIREBASE_PROJECT_ID`              | `your-firebase-project-id`                 |
| `VITE_FIREBASE_STORAGE_BUCKET`          | `your-firebase-storage-bucket`             |
| `VITE_FIREBASE_MESSAGING_SENDER_ID`     | `your-firebase-messaging-sender-id`        |
| `VITE_FIREBASE_APP_ID`                  | `your-firebase-app-id`                     |
