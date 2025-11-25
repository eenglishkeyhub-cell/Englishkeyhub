/* ==========================================
   ADMIN.JS - Teacher Admin Functions
   Full CRUD operations for all collections
   ========================================== */

// ==========================================
// ACHIEVERS CRUD
// ==========================================

async function loadAdminAchievers() {
    try {
        const container = document.getElementById('achieversList');
        if (!container) return;
        
        const snapshot = await db.collection('achievers').orderBy('name').get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No achievers yet. Add one!</p></div>';
            return;
        }
        
        let html = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="card card-custom rounded-4 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">⭐ ${data.name}</h5>
                            <p class="card-text">${data.description}</p>
                            <p class="mb-3"><strong>Grade:</strong> ${data.grade}</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-gradient fw-bold rounded-3" 
                                    onclick="editAchiever('${doc.id}', '${data.name}', '${data.description}', '${data.grade}')">
                                    ✏️ Edit
                                </button>
                                <button class="btn btn-sm btn-danger fw-bold rounded-3" 
                                    onclick="deleteAchiever('${doc.id}')">
                                    🗑️ Delete
                                </button>
                            </div>
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

function editAchiever(id, name, description, grade) {
    document.getElementById('achieverId').value = id;
    document.getElementById('achieverName').value = name;
    document.getElementById('achieverDescription').value = description;
    document.getElementById('achieverGrade').value = grade;
    new bootstrap.Modal(document.getElementById('achieverModal')).show();
}

async function saveAchiever() {
    const id = document.getElementById('achieverId').value;
    const name = document.getElementById('achieverName').value;
    const description = document.getElementById('achieverDescription').value;
    const grade = document.getElementById('achieverGrade').value;
    
    if (!name || !description || !grade) {
        showAlert('Please fill all fields', 'danger');
        return;
    }
    
    try {
        if (id) {
            // Update
            await db.collection('achievers').doc(id).update({
                name, description, grade, updatedAt: new Date()
            });
            showAlert('Achiever updated successfully! ✨', 'success');
        } else {
            // Create
            await db.collection('achievers').add({
                name, description, grade, createdAt: new Date()
            });
            showAlert('Achiever added successfully! ⭐', 'success');
        }
        
        // Reset form
        document.getElementById('achieverForm').reset();
        document.getElementById('achieverId').value = '';
        bootstrap.Modal.getInstance(document.getElementById('achieverModal')).hide();
        loadAdminAchievers();
    } catch (error) {
        showAlert('Error saving achiever: ' + error.message, 'danger');
    }
}

async function deleteAchiever(id) {
    if (!confirm('Are you sure you want to delete this achiever?')) return;
    
    try {
        await db.collection('achievers').doc(id).delete();
        showAlert('Achiever deleted! ✂️', 'success');
        loadAdminAchievers();
    } catch (error) {
        showAlert('Error deleting achiever: ' + error.message, 'danger');
    }
}

// ==========================================
// OUTSTANDING WORK CRUD
// ==========================================

async function loadAdminOutstanding() {
    try {
        const container = document.getElementById('outstandingList');
        if (!container) return;
        
        const snapshot = await db.collection('outstanding_work')
            .orderBy('date', 'desc')
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No outstanding work yet.</p></div>';
            return;
        }
        
        let html = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="card card-custom rounded-4 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">🎨 ${data.title}</h5>
                            <p class="card-text">${data.description}</p>
                            <p class="mb-3"><strong>By:</strong> ${data.studentName}</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-gradient fw-bold rounded-3" 
                                    onclick="editOutstanding('${doc.id}', '${data.title}', '${data.description}', '${data.studentName}')">
                                    ✏️ Edit
                                </button>
                                <button class="btn btn-sm btn-danger fw-bold rounded-3" 
                                    onclick="deleteOutstanding('${doc.id}')">
                                    🗑️ Delete
                                </button>
                            </div>
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

function editOutstanding(id, title, description, studentName) {
    document.getElementById('outstandingId').value = id;
    document.getElementById('outstandingTitle').value = title;
    document.getElementById('outstandingDescription').value = description;
    document.getElementById('outstandingStudent').value = studentName;
    new bootstrap.Modal(document.getElementById('outstandingModal')).show();
}

async function saveOutstanding() {
    const id = document.getElementById('outstandingId').value;
    const title = document.getElementById('outstandingTitle').value;
    const description = document.getElementById('outstandingDescription').value;
    const studentName = document.getElementById('outstandingStudent').value;
    
    if (!title || !description || !studentName) {
        showAlert('Please fill all fields', 'danger');
        return;
    }
    
    try {
        if (id) {
            await db.collection('outstanding_work').doc(id).update({
                title, description, studentName, date: new Date()
            });
            showAlert('Work updated successfully! 🎨', 'success');
        } else {
            await db.collection('outstanding_work').add({
                title, description, studentName, date: new Date()
            });
            showAlert('Work added successfully! 🎨', 'success');
        }
        
        document.getElementById('outstandingForm').reset();
        document.getElementById('outstandingId').value = '';
        bootstrap.Modal.getInstance(document.getElementById('outstandingModal')).hide();
        loadAdminOutstanding();
    } catch (error) {
        showAlert('Error saving work: ' + error.message, 'danger');
    }
}

async function deleteOutstanding(id) {
    if (!confirm('Are you sure?')) return;
    
    try {
        await db.collection('outstanding_work').doc(id).delete();
        showAlert('Work deleted! ✂️', 'success');
        loadAdminOutstanding();
    } catch (error) {
        showAlert('Error deleting work: ' + error.message, 'danger');
    }
}

// ==========================================
// CHAMPIONS CRUD
// ==========================================

async function loadAdminChampions() {
    try {
        const container = document.getElementById('championsList');
        if (!container) return;
        
        const snapshot = await db.collection('competition_champions')
            .orderBy('name')
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No champions yet.</p></div>';
            return;
        }
        
        let html = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="card card-custom rounded-4 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">🏆 ${data.name}</h5>
                            <p class="card-text"><strong>Competition:</strong> ${data.competition}</p>
                            <p class="card-text"><strong>Award:</strong> ${data.award}</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-gradient fw-bold rounded-3" 
                                    onclick="editChampion('${doc.id}', '${data.name}', '${data.competition}', '${data.award}')">
                                    ✏️ Edit
                                </button>
                                <button class="btn btn-sm btn-danger fw-bold rounded-3" 
                                    onclick="deleteChampion('${doc.id}')">
                                    🗑️ Delete
                                </button>
                            </div>
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

function editChampion(id, name, competition, award) {
    document.getElementById('championId').value = id;
    document.getElementById('championName').value = name;
    document.getElementById('championCompetition').value = competition;
    document.getElementById('championAward').value = award;
    new bootstrap.Modal(document.getElementById('championModal')).show();
}

async function saveChampion() {
    const id = document.getElementById('championId').value;
    const name = document.getElementById('championName').value;
    const competition = document.getElementById('championCompetition').value;
    const award = document.getElementById('championAward').value;
    
    if (!name || !competition || !award) {
        showAlert('Please fill all fields', 'danger');
        return;
    }
    
    try {
        if (id) {
            await db.collection('competition_champions').doc(id).update({
                name, competition, award
            });
            showAlert('Champion updated successfully! 🏆', 'success');
        } else {
            await db.collection('competition_champions').add({
                name, competition, award
            });
            showAlert('Champion added successfully! 🏆', 'success');
        }
        
        document.getElementById('championForm').reset();
        document.getElementById('championId').value = '';
        bootstrap.Modal.getInstance(document.getElementById('championModal')).hide();
        loadAdminChampions();
    } catch (error) {
        showAlert('Error saving champion: ' + error.message, 'danger');
    }
}

async function deleteChampion(id) {
    if (!confirm('Are you sure?')) return;
    
    try {
        await db.collection('competition_champions').doc(id).delete();
        showAlert('Champion deleted! ✂️', 'success');
        loadAdminChampions();
    } catch (error) {
        showAlert('Error deleting champion: ' + error.message, 'danger');
    }
}

// ==========================================
// NEWS CRUD
// ==========================================

async function loadAdminNews() {
    try {
        const container = document.getElementById('newsList');
        if (!container) return;
        
        const snapshot = await db.collection('news')
            .orderBy('date', 'desc')
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No news yet.</p></div>';
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
                            <h5 class="card-title fw-bold">📰 ${data.title}</h5>
                            <p class="card-text">${(data.content || '').substring(0, 150)}...</p>
                            <p class="mb-3"><small class="text-muted">📅 ${date.toLocaleDateString()}</small></p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-gradient fw-bold rounded-3" 
                                    onclick="editNews('${doc.id}', '${data.title}', '${data.content.replace(/'/g, "\\'")}', '${date.toISOString().split('T')[0]}')">
                                    ✏️ Edit
                                </button>
                                <button class="btn btn-sm btn-danger fw-bold rounded-3" 
                                    onclick="deleteNews('${doc.id}')">
                                    🗑️ Delete
                                </button>
                            </div>
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

function editNews(id, title, content, date) {
    document.getElementById('newsId').value = id;
    document.getElementById('newsTitle').value = title;
    document.getElementById('newsContent').value = content;
    document.getElementById('newsDate').value = date;
    new bootstrap.Modal(document.getElementById('newsModal')).show();
}

async function saveNews() {
    const id = document.getElementById('newsId').value;
    const title = document.getElementById('newsTitle').value;
    const content = document.getElementById('newsContent').value;
    const dateStr = document.getElementById('newsDate').value;
    
    if (!title || !content || !dateStr) {
        showAlert('Please fill all fields', 'danger');
        return;
    }
    
    try {
        const date = new Date(dateStr);
        if (id) {
            await db.collection('news').doc(id).update({
                title, content, date
            });
            showAlert('News updated successfully! 📰', 'success');
        } else {
            await db.collection('news').add({
                title, content, date
            });
            showAlert('News added successfully! 📰', 'success');
        }
        
        document.getElementById('newsForm').reset();
        document.getElementById('newsId').value = '';
        bootstrap.Modal.getInstance(document.getElementById('newsModal')).hide();
        loadAdminNews();
    } catch (error) {
        showAlert('Error saving news: ' + error.message, 'danger');
    }
}

async function deleteNews(id) {
    if (!confirm('Are you sure?')) return;
    
    try {
        await db.collection('news').doc(id).delete();
        showAlert('News deleted! ✂️', 'success');
        loadAdminNews();
    } catch (error) {
        showAlert('Error deleting news: ' + error.message, 'danger');
    }
}

// ==========================================
// GALLERY CRUD
// ==========================================

async function loadAdminGallery() {
    try {
        const container = document.getElementById('galleryList');
        if (!container) return;
        
        const snapshot = await db.collection('gallery')
            .orderBy('uploadedAt', 'desc')
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No photos yet.</p></div>';
            return;
        }
        
        let html = '';
        snapshot.forEach((doc) => {
            const data = doc.data();
            html += `
                <div class="col-sm-6 col-md-4 col-lg-3">
                    <div class="card card-custom rounded-4 shadow-sm overflow-hidden">
                        <img src="${data.imageUrl}" alt="${data.caption}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <p class="card-text text-center fw-bold">${data.caption}</p>
                            <button class="btn btn-sm btn-danger w-100 fw-bold rounded-3" 
                                onclick="deleteGallery('${doc.id}', '${data.storagePath}')">
                                🗑️ Delete
                            </button>
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

async function saveGallery() {
    const file = document.getElementById('galleryFile').files[0];
    const caption = document.getElementById('galleryCaption').value;
    
    if (!file || !caption) {
        showAlert('Please select a file and add a caption', 'danger');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showAlert('File size must be less than 5MB', 'danger');
        return;
    }
    
    const progressDiv = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('progressBar');
    progressDiv.classList.remove('d-none');
    
    try {
        const fileName = Date.now() + '_' + file.name;
        const storageRef = firebase.storage().ref('gallery/' + fileName);
        
        const uploadTask = storageRef.put(file);
        
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBar.style.width = progress + '%';
            },
            (error) => {
                showAlert('Upload error: ' + error.message, 'danger');
                progressDiv.classList.add('d-none');
            },
            async () => {
                const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
                
                await db.collection('gallery').add({
                    caption,
                    imageUrl,
                    storagePath: 'gallery/' + fileName,
                    uploadedAt: new Date()
                });
                
                showAlert('Photo uploaded successfully! 📸', 'success');
                document.getElementById('galleryForm').reset();
                progressDiv.classList.add('d-none');
                bootstrap.Modal.getInstance(document.getElementById('galleryModal')).hide();
                loadAdminGallery();
            }
        );
    } catch (error) {
        showAlert('Error uploading gallery: ' + error.message, 'danger');
    }
}

async function deleteGallery(id, storagePath) {
    if (!confirm('Are you sure? This cannot be undone.')) return;
    
    try {
        // Delete from storage
        await firebase.storage().ref(storagePath).delete();
        
        // Delete from database
        await db.collection('gallery').doc(id).delete();
        
        showAlert('Photo deleted! ✂️', 'success');
        loadAdminGallery();
    } catch (error) {
        showAlert('Error deleting photo: ' + error.message, 'danger');
    }
}

// ==========================================
// PRESS CRUD
// ==========================================

async function loadAdminPress() {
    try {
        const container = document.getElementById('pressList');
        if (!container) return;
        
        const snapshot = await db.collection('press')
            .orderBy('createdAt', 'desc')
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No press items yet.</p></div>';
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
                            <span class="badge bg-gradient-blue text-white mb-2">${icon} ${data.type}</span>
                            <h5 class="card-title fw-bold">${data.title}</h5>
                            <p class="card-text">${(data.description || '').substring(0, 150)}...</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-gradient fw-bold rounded-3" 
                                    onclick="editPress('${doc.id}', '${data.title}', '${data.description.replace(/'/g, "\\'")}', '${data.type}', '${data.url}')">
                                    ✏️ Edit
                                </button>
                                <button class="btn btn-sm btn-danger fw-bold rounded-3" 
                                    onclick="deletePress('${doc.id}')">
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading press:', error);
    }
}

function editPress(id, title, description, type, url) {
    document.getElementById('pressId').value = id;
    document.getElementById('pressTitle').value = title;
    document.getElementById('pressDescription').value = description;
    document.getElementById('pressType').value = type;
    document.getElementById('pressUrl').value = url;
    new bootstrap.Modal(document.getElementById('pressModal')).show();
}

async function savePress() {
    const id = document.getElementById('pressId').value;
    const title = document.getElementById('pressTitle').value;
    const description = document.getElementById('pressDescription').value;
    const type = document.getElementById('pressType').value;
    const url = document.getElementById('pressUrl').value;
    
    if (!title || !description || !type || !url) {
        showAlert('Please fill all fields', 'danger');
        return;
    }
    
    try {
        if (id) {
            await db.collection('press').doc(id).update({
                title, description, type, url
            });
            showAlert('Press item updated successfully! 🎥', 'success');
        } else {
            await db.collection('press').add({
                title, description, type, url, createdAt: new Date()
            });
            showAlert('Press item added successfully! 🎥', 'success');
        }
        
        document.getElementById('pressForm').reset();
        document.getElementById('pressId').value = '';
        bootstrap.Modal.getInstance(document.getElementById('pressModal')).hide();
        loadAdminPress();
    } catch (error) {
        showAlert('Error saving press item: ' + error.message, 'danger');
    }
}

async function deletePress(id) {
    if (!confirm('Are you sure?')) return;
    
    try {
        await db.collection('press').doc(id).delete();
        showAlert('Press item deleted! ✂️', 'success');
        loadAdminPress();
    } catch (error) {
        showAlert('Error deleting press item: ' + error.message, 'danger');
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function showAlert(message, type) {
    const alertHtml = `
        <div class="alert alert-${type} rounded-3 shadow-sm alert-dismissible fade show" role="alert" 
             style="position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    const temp = document.createElement('div');
    temp.innerHTML = alertHtml;
    document.body.appendChild(temp.firstChild);
    
    setTimeout(() => {
        const alert = document.querySelector('.alert:last-child');
        if (alert) alert.remove();
    }, 4000);
}
