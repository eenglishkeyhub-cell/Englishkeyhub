/* ==========================================
   STUDENT.JS - Student-Facing Functions
   Reads data from Firebase for public pages
   ========================================== */

// ==========================================
// ACHIEVERS - Load and Display
// ==========================================

async function loadHighlights() {
    try {
        const container = document.getElementById('highlightsContainer');
        if (!container) return;
        
        const snapshot = await db.collection('news')
            .orderBy('date', 'desc')
            .limit(3)
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No highlights yet. Check back soon! 🌟</p></div>';
            return;
        }
        
        let html = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="card card-custom rounded-4 shadow-sm h-100">
                        <div class="card-body">
                            <h5 class="card-title fw-bold mb-2">✨ ${data.title || 'Untitled'}</h5>
                            <p class="card-text">${(data.content || '').substring(0, 100)}...</p>
                            <small class="text-muted">📅 ${new Date(data.date?.toDate?.() || data.date).toLocaleDateString()}</small>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading highlights:', error);
    }
}

async function loadAchievers(limit = null) {
    try {
        const container = document.getElementById('achieversContainer');
        if (!container) return;
        
        let query = db.collection('achievers').orderBy('name');
        if (limit) query = query.limit(limit);
        
        const snapshot = await query.get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No achievers yet. More coming soon! ⭐</p></div>';
            return;
        }
        
        let html = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="card card-custom rounded-4 shadow-sm h-100">
                        <div class="card-body text-center">
                            <div class="icon-circle bg-gradient-pink mb-3" style="margin: 0 auto;">👩‍🎓</div>
                            <h5 class="card-title fw-bold">${data.name}</h5>
                            <p class="card-text">${data.description}</p>
                            <span class="badge bg-gradient-pink text-white">${data.grade}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading achievers:', error);
    }
}

// ==========================================
// OUTSTANDING WORK - Load and Display
// ==========================================

async function loadOutstandingWork() {
    try {
        const container = document.getElementById('outstandingContainer');
        if (!container) return;
        
        const snapshot = await db.collection('outstanding_work')
            .orderBy('date', 'desc')
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No outstanding work yet. Check back soon! 🎨</p></div>';
            return;
        }
        
        let html = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="card card-custom rounded-4 shadow-sm h-100">
                        <div class="card-body">
                            <h5 class="card-title fw-bold mb-2">🎨 ${data.title}</h5>
                            <p class="card-text">${data.description}</p>
                            <p class="mb-2"><strong>By:</strong> ${data.studentName}</p>
                            <small class="text-muted">📅 ${new Date(data.date?.toDate?.() || new Date()).toLocaleDateString()}</small>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading outstanding work:', error);
    }
}

// ==========================================
// COMPETITION CHAMPIONS - Load and Display
// ==========================================

async function loadChampions() {
    try {
        const container = document.getElementById('championsContainer');
        if (!container) return;
        
        const snapshot = await db.collection('competition_champions')
            .orderBy('name')
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No champions yet. Keep trying! 🏆</p></div>';
            return;
        }
        
        let html = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="card card-custom rounded-4 shadow-sm h-100">
                        <div class="card-body text-center">
                            <div style="font-size: 3rem; margin-bottom: 16px;">🏆</div>
                            <h5 class="card-title fw-bold">${data.name}</h5>
                            <p class="card-text"><strong>${data.competition}</strong></p>
                            <span class="badge bg-gradient-green text-white">${data.award}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading champions:', error);
    }
}

// ==========================================
// NEWS - Load and Display
// ==========================================

async function loadNews() {
    try {
        const container = document.getElementById('newsContainer');
        if (!container) return;
        
        const snapshot = await db.collection('news')
            .orderBy('date', 'desc')
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No news yet. Check back later! 📰</p></div>';
            return;
        }
        
        let html = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            const date = new Date(data.date?.toDate?.() || data.date);
            html += `
                <div class="col-lg-8">
                    <div class="card card-custom rounded-4 shadow-sm">
                        <div class="card-body">
                            <h4 class="card-title fw-bold mb-3">📰 ${data.title}</h4>
                            <p class="card-text">${data.content}</p>
                            <small class="text-muted">📅 ${date.toLocaleDateString()}</small>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

// ==========================================
// GALLERY - Load and Display
// ==========================================

async function loadGallery() {
    try {
        const container = document.getElementById('galleryContainer');
        if (!container) return;
        
        const snapshot = await db.collection('gallery')
            .orderBy('uploadedAt', 'desc')
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No photos yet. More coming soon! 📸</p></div>';
            return;
        }
        
        let html = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <div class="col-sm-6 col-md-4 col-lg-3">
                    <div class="card card-custom rounded-4 shadow-sm overflow-hidden h-100" style="cursor: pointer;" 
                         data-bs-toggle="modal" data-bs-target="#imageModal"
                         onclick="showImageModal('${data.imageUrl}', '${data.caption}')">
                        <img src="${data.imageUrl}" alt="${data.caption}" style="height: 250px; object-fit: cover;">
                        <div class="card-body">
                            <p class="card-text text-center fw-bold">${data.caption}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

function showImageModal(imageUrl, caption) {
    document.getElementById('modalImage').src = imageUrl;
    document.getElementById('modalCaption').textContent = caption;
}

// ==========================================
// PRESS - Load and Display
// ==========================================

async function loadPress() {
    try {
        const container = document.getElementById('pressContainer');
        if (!container) return;
        
        const snapshot = await db.collection('press')
            .orderBy('createdAt', 'desc')
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No press items yet. Check back soon! 🎥</p></div>';
            return;
        }
        
        let html = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            let icon = '📰';
            if (data.type === 'Video') icon = '🎥';
            if (data.type === 'Interview') icon = '🎙️';
            
            html += `
                <div class="col-lg-8">
                    <div class="card card-custom rounded-4 shadow-sm">
                        <div class="card-body">
                            <div class="mb-3">
                                <span class="badge bg-gradient-blue text-white">${icon} ${data.type}</span>
                            </div>
                            <h4 class="card-title fw-bold mb-3">${data.title}</h4>
                            <p class="card-text">${data.description}</p>
                            <a href="${data.url}" target="_blank" class="btn btn-gradient rounded-3 fw-bold">
                                Read More 🔗
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading press items:', error);
    }
}

async function loadPressItems() {
    // Alias for loadPress
    return loadPress();
}
