/* ==========================================
   FIREBASE CONFIGURATION
   ========================================== */

// ⚠️ IMPORTANT: Replace the values below with your Firebase credentials
// How to get these values? See SETUP.md file for complete instructions

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references to Firestore, Auth, and Storage
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Optional: Set offline persistence (for better offline support)
firebase.firestore().enablePersistence()
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
            console.log('The current browser does not support offline persistence');
        }
    });
