# Fatima Program Website - Complete Setup Guide

Welcome! This guide will walk you through setting up and deploying your Fatima Program website.

## Table of Contents
1. [Firebase Setup](#firebase-setup)
2. [Configuration](#configuration)
3. [Deployment](#deployment)
4. [Database Structure](#database-structure)
5. [Features Overview](#features-overview)
6. [Troubleshooting](#troubleshooting)

---

## Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a new project"** or **"Add project"**
3. Enter project name: `Fatima-Program` (or your preferred name)
4. Select country/region
5. Click **"Create project"** (you can disable Google Analytics for simplicity)
6. Wait for project creation to complete

### Step 2: Set Up Authentication

1. In Firebase console, go to **Build → Authentication**
2. Click **"Get Started"**
3. Click **"Email/Password"** option
4. Enable it by toggling the switch
5. Click **"Save"**

### Step 3: Create Firestore Database

1. Go to **Build → Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"** 
4. Choose your region (closest to your users)
5. Click **"Create"**

### Step 4: Set Firestore Security Rules

⚠️ **IMPORTANT:** For now, use this for development (NOT for production):

1. Go to **Firestore Database → Rules** tab
2. Replace all content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to all collections
    match /{document=**} {
      allow read;
    }
    
    // Authenticated write access
    match /{document=**} {
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

> 📌 **For Production:** Implement stricter rules that only allow teachers to write.

### Step 5: Set Up Firebase Storage

1. Go to **Build → Storage**
2. Click **"Get Started"**
3. Choose region (same as Firestore)
4. Click **"Done"**

### Step 6: Set Up Storage Rules

1. Go to **Storage → Rules** tab
2. Replace all content with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read access to gallery images
    match /gallery/{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
    
    // Authenticated write to gallery
    match /gallery/{fileName} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### Step 7: Get Your Firebase Config

1. Go to **Project Settings** (click gear icon)
2. Scroll to **"Your apps"** section
3. Click **"</>  Web"** icon to create a web app
4. Register the app: `Fatima-Program`
5. Copy the entire config object
6. You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDx...",
  authDomain: "fatima-program.firebaseapp.com",
  projectId: "fatima-program",
  storageBucket: "fatima-program.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

---

## Configuration

### Step 1: Update firebaseConfig.js

1. Open `assets/js/firebaseConfig.js` in your code editor
2. Replace the placeholder values with your actual Firebase config
3. Example:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDx1234567890abcdefghijklmnopqrstu",
    authDomain: "fatima-program-123abc.firebaseapp.com",
    projectId: "fatima-program-123abc",
    storageBucket: "fatima-program-123abc.appspot.com",
    messagingSenderId: "987654321098",
    appId: "1:987654321098:web:xyz1234567890abcde"
};
```

**Save the file!**

### Step 2: Create Teacher Admin Account

1. Go to Firebase Console → Authentication → Users
2. Click **"Add user"**
3. Enter teacher's email address
4. Create a strong password
5. Click **"Add user"**

> 💡 Teachers will use this email/password to login at `admin/login.html`

---

## Database Structure

### Create Collections and Sample Data

Go to **Firestore Database** and create these collections:

#### 1. **achievers** Collection
Add a document with fields:
- `name` (string): "Sara Khan"
- `description` (string): "Excellent in mathematics and science"
- `grade` (string): "Grade 6"
- `createdAt` (timestamp): auto

#### 2. **outstanding_work** Collection
Add a document with fields:
- `title` (string): "Beautiful Poem on Nature"
- `description` (string): "A heartfelt poem about environmental conservation"
- `studentName` (string): "Fatima Ali"
- `date` (timestamp): today

#### 3. **competition_champions** Collection
Add a document with fields:
- `name` (string): "Aisha Khan"
- `competition` (string): "National Science Olympiad"
- `award` (string): "First Prize 🥇"

#### 4. **news** Collection
Add a document with fields:
- `title` (string): "Summer Program 2025 Announcement"
- `content` (string): "We are excited to announce our summer program..."
- `date` (timestamp): today

#### 5. **gallery** Collection
Leave empty initially - teachers will upload photos via dashboard

#### 6. **press** Collection
Add a document with fields:
- `title` (string): "BBC Features Fatima Program"
- `description` (string): "The BBC recently featured our program..."
- `type` (string): "Article"
- `url` (string): "https://bbc.com/..."
- `createdAt` (timestamp): today

---

## Deployment

### Option 1: Deploy with Netlify (Recommended - Free & Easy)

#### Step 1: Prepare Your Files
1. Make sure all files are in your project folder:
   - `index.html`, `about.html`, `components.html`, `news.html`, `gallery.html`, `press.html`
   - `admin/login.html`, `admin/dashboard.html`
   - `assets/css/style.css`
   - `assets/js/firebaseConfig.js`, `student.js`, `admin.js`

#### Step 2: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in (or create account)
2. Click **"New"** to create new repository
3. Name it: `fatima-program-website`
4. Make it **Public**
5. Click **"Create repository"**

#### Step 3: Upload Files to GitHub
1. Click **"uploading an existing file"** link
2. Or use Git CLI:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fatima-program-website.git
git push -u origin main
```

#### Step 4: Deploy on Netlify
1. Go to [Netlify.com](https://netlify.com)
2. Click **"Sign up"** and choose **"GitHub"**
3. Authorize Netlify to access your GitHub
4. Click **"New site from Git"**
5. Select your repository: `fatima-program-website`
6. Click **"Deploy site"**
7. Wait for deployment (usually 2-5 minutes)
8. Your site will get a URL like: `https://fatima-program-xyz123.netlify.app`

✅ **Your website is now live!**

---

### Option 2: Deploy with GitHub Pages (Free)

1. Push your code to GitHub (same as above)
2. Go to your repository settings
3. Scroll to **"GitHub Pages"**
4. Select **"main"** branch as source
5. Click **"Save"**
6. Your site will be available at: `https://YOUR_USERNAME.github.io/fatima-program-website/`

---

### Option 3: Deploy Locally (For Testing)

1. Open your project folder in VS Code
2. Right-click `index.html` and select **"Open with Live Server"**
3. Or use Python: `python -m http.server 8000`
4. Visit `http://localhost:8000`

---

## Features Overview

### Public Pages (No Login Required)
✅ **Home** - Welcome hero, program overview, highlights
✅ **About** - Mission, values, learning outcomes
✅ **Components** - Achievers, outstanding work, champions, press
✅ **News** - Latest updates from Firebase
✅ **Gallery** - Photos from Firebase Storage
✅ **Press** - Articles, videos, interviews

### Teacher Admin Area (Login Required)
🔒 **Dashboard** - All CRUD operations for:
- ⭐ Add/Edit/Delete Achievers
- 🎨 Add/Edit/Delete Outstanding Work
- 🏆 Add/Edit/Delete Champions
- 📰 Add/Edit/Delete News
- 📸 Upload/Delete Gallery Photos
- 🎥 Add/Edit/Delete Press Items

### Firebase Integration
✅ Real-time data synchronization
✅ Authentication & authorization
✅ File storage for images
✅ Automatic timestamps

---

## Troubleshooting

### Issue: "Firebase is not defined"
**Solution:** Make sure `firebaseConfig.js` is loaded BEFORE `student.js` and `admin.js` in your HTML files.

```html
<script src="assets/js/firebaseConfig.js"></script>
<script src="assets/js/student.js"></script>
```

### Issue: Data not loading
**Solution:** 
1. Check Firestore rules are published
2. Verify collections exist in Firebase
3. Check browser console for errors (F12)
4. Ensure firebaseConfig is correct

### Issue: Gallery upload fails
**Solution:**
1. Check Storage rules are published
2. Verify teacher is logged in
3. Check file size < 5MB
4. Check storage quota

### Issue: Login not working
**Solution:**
1. Verify teacher account exists in Firebase Authentication
2. Use correct email and password
3. Check Firestore rules allow authenticated users
4. Clear browser cache

### Issue: Deployed site shows blank
**Solution:**
1. Check all file paths are correct (relative paths)
2. Verify `firebaseConfig.js` is in `assets/js/` folder
3. Check browser console for CORS errors
4. Make sure Firebase rules allow public reads

---

## Production Checklist

Before going live:

- [ ] Test all pages work correctly
- [ ] Test login/logout functionality
- [ ] Test CRUD operations (Add, Edit, Delete)
- [ ] Test gallery upload with different image sizes
- [ ] Update Firebase security rules for production
- [ ] Create admin accounts for all teachers
- [ ] Test on mobile devices
- [ ] Enable HTTPS (Netlify does this automatically)
- [ ] Set custom domain (optional)
- [ ] Add Google Analytics (optional)

---

## Security Notes

⚠️ **For Production:**
1. Update Firestore rules to only allow authenticated users to write
2. Update Storage rules to validate file types and sizes
3. Use environment variables for sensitive data
4. Regular backups of Firestore data
5. Monitor Firebase console for suspicious activity

---

## Support & Contact

For issues or questions:
1. Check browser console (F12) for errors
2. Review Firebase documentation: https://firebase.google.com/docs
3. Check Netlify deployment logs
4. Contact Firebase support

---

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Bootstrap Documentation](https://getbootstrap.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [GitHub Pages Documentation](https://pages.github.com)

---

**Happy deploying! 🎉 Your Fatima Program website is now ready to inspire and empower girls aged 11-13! 💜**
