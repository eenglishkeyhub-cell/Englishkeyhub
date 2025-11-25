# Code Examples & Snippets

This file contains common code snippets and examples for customization.

## Table of Contents
1. [Color Customization](#color-customization)
2. [Adding New Fields](#adding-new-fields)
3. [Creating New Pages](#creating-new-pages)
4. [Firebase Rules](#firebase-rules)
5. [Common Functions](#common-functions)

---

## Color Customization

### Change Primary Colors

Open `assets/css/style.css` and find the `:root` section:

```css
:root {
    /* Change these hex codes to your colors */
    --primary-pink: #FF6B9D;      /* Main pink */
    --primary-purple: #7D4DFF;    /* Purple */
    --primary-blue: #0984E3;      /* Blue */
    --primary-green: #00B894;     /* Green */
    --primary-yellow: #FDCB6E;    /* Yellow */
}
```

**Example: Make it more purpley**
```css
--primary-pink: #C678DD;
--primary-purple: #9D4EDD;
--primary-blue: #7D4DFF;
```

**Save and refresh the browser!**

### Color Palette Ideas

Classic Pink:
```css
--primary-pink: #FF69B4;
--primary-purple: #DA70D6;
```

Ocean Theme:
```css
--primary-blue: #0077B6;
--primary-green: #00B4D8;
--primary-purple: #0096C7;
```

Sunset Theme:
```css
--primary-pink: #FF6B6B;
--primary-yellow: #FFA500;
--primary-purple: #A569BD;
```

---

## Adding New Fields to Collections

### Add a new field to Achievers

**Step 1: Update Admin Dashboard**

Open `admin/dashboard.html` and find the Achiever Modal section:

```html
<div class="mb-3">
    <label class="form-label fw-bold">Grade</label>
    <input type="text" class="form-control rounded-3" id="achieverGrade" required>
</div>

<!-- ADD THIS NEW FIELD -->
<div class="mb-3">
    <label class="form-label fw-bold">Award/Achievement Level</label>
    <select class="form-control rounded-3" id="achieverLevel" required>
        <option value="">Select Level</option>
        <option value="Gold">Gold</option>
        <option value="Silver">Silver</option>
        <option value="Bronze">Bronze</option>
    </select>
</div>
```

**Step 2: Update admin.js**

Find `saveAchiever()` function and modify:

```javascript
async function saveAchiever() {
    const id = document.getElementById('achieverId').value;
    const name = document.getElementById('achieverName').value;
    const description = document.getElementById('achieverDescription').value;
    const grade = document.getElementById('achieverGrade').value;
    const level = document.getElementById('achieverLevel').value;  // NEW LINE
    
    if (!name || !description || !grade || !level) {
        showAlert('Please fill all fields', 'danger');
        return;
    }
    
    try {
        if (id) {
            await db.collection('achievers').doc(id).update({
                name, description, grade, level, updatedAt: new Date()  // ADD level
            });
        } else {
            await db.collection('achievers').add({
                name, description, grade, level, createdAt: new Date()  // ADD level
            });
        }
        // ... rest of function
    }
}
```

---

## Creating New Pages

### Add a New Public Page

**Step 1: Create HTML File**

Copy `about.html` and save as `events.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Events - Fatima Program</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <!-- Navigation (copy from any other page) -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm">
        <!-- ... -->
        <li class="nav-item"><a class="nav-link active" href="events.html">Events</a></li>
        <!-- ... -->
    </nav>

    <!-- Your Content -->
    <section class="hero-section-small bg-gradient text-white py-4 text-center">
        <div class="container">
            <h1 class="display-5 fw-bold">Our Events 🎉</h1>
        </div>
    </section>

    <section class="py-5">
        <div class="container">
            <h2 class="fw-bold mb-4">Upcoming Events</h2>
            <div id="eventsContainer" class="row g-4">
                <!-- Content here -->
            </div>
        </div>
    </section>

    <!-- Footer (copy from any page) -->
    <footer class="bg-dark text-white text-center py-4">
        <!-- ... -->
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/firebaseConfig.js"></script>
    <script src="assets/js/student.js"></script>
</body>
</html>
```

**Step 2: Add to Navigation**

In every HTML file, add to navbar:
```html
<li class="nav-item"><a class="nav-link" href="events.html">Events</a></li>
```

**Step 3: Create Firebase Collection**

In Firestore, create collection: `events`

**Step 4: Add Load Function**

In `assets/js/student.js`, add:

```javascript
async function loadEvents() {
    try {
        const container = document.getElementById('eventsContainer');
        if (!container) return;
        
        const snapshot = await db.collection('events')
            .orderBy('date', 'asc')
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No events yet.</p></div>';
            return;
        }
        
        let html = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="card card-custom rounded-4 shadow-sm h-100">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">🎉 ${data.title}</h5>
                            <p class="card-text">${data.description}</p>
                            <p><strong>Date:</strong> ${new Date(data.date?.toDate?.() || data.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading events:', error);
    }
}
```

---

## Firebase Rules

### Firestore Rules (Production)

Open Firestore Rules and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access
    match /{document=**} {
      allow read;
    }
    
    // Only authenticated teachers can write
    match /achievers/{doc} {
      allow create, update, delete: if request.auth != null;
    }
    
    match /news/{doc} {
      allow create, update, delete: if request.auth != null;
    }
    
    match /gallery/{doc} {
      allow create, update, delete: if request.auth != null;
    }
    
    match /press/{doc} {
      allow create, update, delete: if request.auth != null;
    }
    
    match /outstanding_work/{doc} {
      allow create, update, delete: if request.auth != null;
    }
    
    match /competition_champions/{doc} {
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

### Storage Rules (Production)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read access to gallery
    match /gallery/{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Common Functions

### Add Alert/Toast Notification

Already in `admin.js`, but here's how to use it:

```javascript
// Success alert
showAlert('Item added successfully! ✅', 'success');

// Error alert
showAlert('Something went wrong!', 'danger');

// Info alert
showAlert('Please select an image first', 'info');

// Warning alert
showAlert('This action cannot be undone', 'warning');
```

### Delete with Confirmation

```javascript
async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this?')) return;
    
    try {
        await db.collection('achievers').doc(id).delete();
        showAlert('Deleted successfully! ✂️', 'success');
        loadAdminAchievers();
    } catch (error) {
        showAlert('Error: ' + error.message, 'danger');
    }
}
```

### Update Document

```javascript
async function updateAchiever(id) {
    try {
        await db.collection('achievers').doc(id).update({
            name: 'New Name',
            description: 'New Description',
            updatedAt: new Date()
        });
        showAlert('Updated successfully! ✅', 'success');
    } catch (error) {
        showAlert('Error: ' + error.message, 'danger');
    }
}
```

### Query with Filters

```javascript
// Get achievers from specific grade only
async function getGrade6Achievers() {
    try {
        const snapshot = await db.collection('achievers')
            .where('grade', '==', 'Grade 6')
            .get();
        
        snapshot.forEach((doc) => {
            console.log(doc.data());
        });
    } catch (error) {
        console.error(error);
    }
}
```

### Upload to Storage

```javascript
async function uploadImage(file) {
    try {
        const fileName = Date.now() + '_' + file.name;
        const storageRef = firebase.storage().ref('gallery/' + fileName);
        
        const uploadTask = storageRef.put(file);
        
        // Progress tracking
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload ' + progress + '% done');
            },
            (error) => {
                console.error('Upload error:', error);
            },
            async () => {
                const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
                console.log('File available at:', imageUrl);
            }
        );
    } catch (error) {
        console.error('Error:', error);
    }
}
```

### Get Current User

```javascript
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log('Logged in as:', user.email);
        console.log('User ID:', user.uid);
    } else {
        console.log('Not logged in');
    }
});
```

### Logout

```javascript
function logout() {
    firebase.auth().signOut().then(() => {
        console.log('Logged out');
        window.location.href = '../index.html';
    }).catch((error) => {
        console.error('Logout error:', error);
    });
}
```

---

## Quick Copy-Paste Examples

### Create New Modal Form

```html
<div class="modal fade" id="eventModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4">
            <div class="modal-header bg-gradient text-white">
                <h5 class="modal-title fw-bold">Add Event</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="eventForm">
                    <div class="mb-3">
                        <label class="form-label fw-bold">Event Title</label>
                        <input type="text" class="form-control rounded-3" id="eventTitle" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Date</label>
                        <input type="date" class="form-control rounded-3" id="eventDate" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary rounded-3" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-gradient rounded-3 fw-bold" onclick="saveEvent()">Save</button>
            </div>
        </div>
    </div>
</div>
```

### Create New Data Card

```html
<div class="card card-custom rounded-4 shadow-sm h-100">
    <div class="card-body">
        <h5 class="card-title fw-bold">📌 Title Here</h5>
        <p class="card-text">Description text here</p>
        <div class="d-flex gap-2">
            <button class="btn btn-sm btn-gradient fw-bold rounded-3">✏️ Edit</button>
            <button class="btn btn-sm btn-danger fw-bold rounded-3">🗑️ Delete</button>
        </div>
    </div>
</div>
```

### Create New Admin Tab

```html
<div class="tab-pane fade" id="events">
    <div class="card card-custom rounded-4 shadow-sm">
        <div class="card-header bg-gradient text-white rounded-top-4">
            <div class="row align-items-center">
                <div class="col">
                    <h5 class="mb-0">🎉 Manage Events</h5>
                </div>
                <div class="col-auto">
                    <button class="btn btn-light btn-sm fw-bold rounded-3" data-bs-toggle="modal" data-bs-target="#eventModal">
                        ➕ Add Event
                    </button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div id="eventsList" class="row g-4">
                <!-- Loaded from Firebase -->
            </div>
        </div>
    </div>
</div>
```

---

## Styling Examples

### Make a Button Full Width

```html
<button class="btn btn-gradient w-100 fw-bold rounded-3">Click Me</button>
```

### Add Shadow to Card

```html
<div class="card shadow-lg rounded-4">
    <!-- Content -->
</div>
```

### Center Content

```html
<div class="d-flex justify-content-center align-items-center" style="height: 300px;">
    <p>Centered content</p>
</div>
```

### Add Gradient Background

```html
<div class="bg-gradient text-white p-5">
    <h1>Gradient Background</h1>
</div>
```

---

This file covers the most common customizations. For more examples, check the existing code!
