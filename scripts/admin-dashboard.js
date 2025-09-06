// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.currentUser = null;
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.storage = firebase.storage();
        this.init();
    }

    async init() {
        try {
            // Create default admin user if it doesn't exist
            await this.createDefaultAdminUser();
            
            // Check authentication
            await this.checkAuth();
            
            // Initialize navigation
            this.initNavigation();
            
            // Load dashboard data
            await this.loadDashboardData();
            
            // Initialize event listeners
            this.initEventListeners();
            
            // Load initial section
            this.showSection('dashboard');
            
        } catch (error) {
            console.error('Admin dashboard initialization error:', error);
            this.showNotification('Error initializing admin dashboard', 'error');
        }
    }

    async createDefaultAdminUser() {
        try {
            console.log('Checking for default admin user...');
            
            // Check if default admin user exists in Firestore
            const adminQuery = await this.db.collection('users')
                .where('email', '==', 'nestmateusa@gmail.com')
                .where('role', '==', 'admin')
                .get();
            
            if (!adminQuery.empty) {
                console.log('Default admin user already exists');
                return;
            }
            
            console.log('Creating default admin user...');
            
            // Create user in Firebase Authentication
            const userCredential = await this.auth.createUserWithEmailAndPassword(
                'nestmateusa@gmail.com',
                'Test123'
            );
            
            console.log('Default admin user created in Authentication:', userCredential.user.uid);
            
            // Set admin role in Firestore
            await this.db.collection('users').doc(userCredential.user.uid).set({
                uid: userCredential.user.uid,
                email: 'nestmateusa@gmail.com',
                role: 'admin',
                name: 'NestMate Admin',
                status: 'active',
                createdAt: new Date(),
                isDefaultAdmin: true
            });
            
            console.log('Default admin user created successfully!');
            console.log('Email: nestmateusa@gmail.com');
            console.log('Password: Test123');
            
            // Sign out the automatically created user
            await this.auth.signOut();
            
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                console.log('Default admin user already exists in Authentication');
                
                // Try to find the existing user and set admin role
                try {
                    const userCredential = await this.auth.signInWithEmailAndPassword(
                        'nestmateusa@gmail.com',
                        'Test123'
                    );
                    
                    // Check if user document exists in Firestore
                    const userDoc = await this.db.collection('users').doc(userCredential.user.uid).get();
                    
                    if (!userDoc.exists) {
                        // Create user document with admin role
                        await this.db.collection('users').doc(userCredential.user.uid).set({
                            uid: userCredential.user.uid,
                            email: 'nestmateusa@gmail.com',
                            role: 'admin',
                            name: 'NestMate Admin',
                            status: 'active',
                            createdAt: new Date(),
                            isDefaultAdmin: true
                        });
                        console.log('Admin role set for existing user');
                    } else if (userDoc.data().role !== 'admin') {
                        // Update existing user to admin role
                        await this.db.collection('users').doc(userCredential.user.uid).update({
                            role: 'admin',
                            isDefaultAdmin: true
                        });
                        console.log('User role updated to admin');
                    }
                    
                    // Sign out
                    await this.auth.signOut();
                    
                } catch (signInError) {
                    console.error('Error setting admin role for existing user:', signInError);
                }
                
            } else {
                console.error('Error creating default admin user:', error);
            }
        }
    }

    async checkAuth() {
        return new Promise((resolve, reject) => {
            this.auth.onAuthStateChanged(async (user) => {
                if (user) {
                    // Check if user has admin role
                    const userDoc = await this.db.collection('users').doc(user.uid).get();
                    if (userDoc.exists && userDoc.data().role === 'admin') {
                        this.currentUser = user;
                        resolve(user);
                    } else {
                        this.showNotification('Access denied. Admin privileges required.', 'error');
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 2000);
                        reject(new Error('Not admin'));
                    }
                } else {
                    this.showNotification('Please log in to access admin panel', 'warning');
                    setTimeout(() => {
                        window.location.href = 'signin.html';
                    }, 2000);
                    reject(new Error('Not authenticated'));
                }
            });
        });
    }

    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    showSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.style.display = 'none';
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.style.display = 'block';
            this.loadSectionData(sectionName);
        }
    }

    async loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'users':
                await this.loadUsersData();
                break;
            case 'sellers':
                await this.loadSellersData();
                break;
            case 'sales':
                await this.loadSalesData();
                break;
            case 'content':
                await this.loadContentData();
                break;
            case 'reports':
                await this.loadReportsData();
                break;
            case 'security':
                await this.loadSecurityData();
                break;
        }
    }

    async loadDashboardData() {
        try {
            // Load statistics
            const stats = await this.getDashboardStats();
            this.updateDashboardStats(stats);
            
            // Load recent activity
            await this.loadRecentActivity();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showNotification('Error loading dashboard data', 'error');
        }
    }

    async getDashboardStats() {
        const stats = {
            totalUsers: 0,
            totalSellers: 0,
            totalSales: 0,
            totalRevenue: 0
        };

        try {
            // Get user count
            const usersSnapshot = await this.db.collection('users').get();
            stats.totalUsers = usersSnapshot.size;

            // Get seller count
            const sellersSnapshot = await this.db.collection('sellers').get();
            stats.totalSellers = sellersSnapshot.size;

            // Get sales data
            const salesSnapshot = await this.db.collection('sales').get();
            stats.totalSales = salesSnapshot.size;
            
            let totalRevenue = 0;
            salesSnapshot.forEach(doc => {
                const sale = doc.data();
                if (sale.amount) {
                    totalRevenue += parseFloat(sale.amount);
                }
            });
            stats.totalRevenue = totalRevenue;

        } catch (error) {
            console.error('Error getting stats:', error);
        }

        return stats;
    }

    updateDashboardStats(stats) {
        document.getElementById('total-users').textContent = stats.totalUsers.toLocaleString();
        document.getElementById('total-sellers').textContent = stats.totalSellers.toLocaleString();
        document.getElementById('total-sales').textContent = stats.totalSales.toLocaleString();
        document.getElementById('total-revenue').textContent = `$${stats.totalRevenue.toLocaleString()}`;
    }

    async loadRecentActivity() {
        try {
            const activitySnapshot = await this.db.collection('activity')
                .orderBy('timestamp', 'desc')
                .limit(10)
                .get();

            const tbody = document.querySelector('#recent-activity-table tbody');
            tbody.innerHTML = '';

            if (activitySnapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No recent activity</td></tr>';
                return;
            }

            activitySnapshot.forEach(doc => {
                const activity = doc.data();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${activity.userName || 'Unknown'}</td>
                    <td>${activity.action}</td>
                    <td>${activity.details}</td>
                    <td>${this.formatDate(activity.timestamp)}</td>
                    <td><span class="badge active">Completed</span></td>
                `;
                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error loading recent activity:', error);
        }
    }

    async loadUsersData() {
        try {
            const usersSnapshot = await this.db.collection('users').get();
            const tbody = document.querySelector('#users-table tbody');
            tbody.innerHTML = '';

            if (usersSnapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">No users found</td></tr>';
                return;
            }

            usersSnapshot.forEach(doc => {
                const user = doc.data();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.name || 'N/A'}</td>
                    <td>${user.email}</td>
                    <td>${user.role || 'user'}</td>
                    <td><span class="badge ${user.status || 'active'}">${user.status || 'active'}</span></td>
                    <td>${this.formatDate(user.createdAt)}</td>
                    <td>
                        <button class="btn btn-outline" onclick="editUser('${doc.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="deleteUser('${doc.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error loading users:', error);
            this.showNotification('Error loading users', 'error');
        }
    }

    async loadSellersData() {
        try {
            const sellersSnapshot = await this.db.collection('sellers').get();
            const tbody = document.querySelector('#sellers-table tbody');
            tbody.innerHTML = '';

            if (sellersSnapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">No sellers found</td></tr>';
                return;
            }

            sellersSnapshot.forEach(doc => {
                const seller = doc.data();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${seller.businessName || 'N/A'}</td>
                    <td>${seller.contactPerson || 'N/A'}</td>
                    <td>${seller.email}</td>
                    <td><span class="badge ${seller.status || 'pending'}">${seller.status || 'pending'}</span></td>
                    <td><span class="badge ${seller.verified ? 'active' : 'pending'}">${seller.verified ? 'Verified' : 'Pending'}</span></td>
                    <td>
                        <button class="btn btn-outline" onclick="editSeller('${doc.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-success" onclick="verifySeller('${doc.id}')">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-danger" onclick="deleteSeller('${doc.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error loading sellers:', error);
            this.showNotification('Error loading sellers', 'error');
        }
    }

    async loadSalesData() {
        try {
            // Update sales statistics
            const salesSnapshot = await this.db.collection('sales').get();
            let monthlySales = 0;
            let monthlyRevenue = 0;
            let totalAmount = 0;
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            salesSnapshot.forEach(doc => {
                const sale = doc.data();
                const saleDate = sale.timestamp ? new Date(sale.timestamp.toDate()) : new Date();
                
                if (saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear) {
                    monthlySales++;
                    if (sale.amount) {
                        monthlyRevenue += parseFloat(sale.amount);
                    }
                }
                
                if (sale.amount) {
                    totalAmount += parseFloat(sale.amount);
                }
            });

            const avgOrder = salesSnapshot.size > 0 ? totalAmount / salesSnapshot.size : 0;
            const conversionRate = 15.5; // Mock data

            document.getElementById('monthly-sales').textContent = monthlySales.toLocaleString();
            document.getElementById('monthly-revenue').textContent = `$${monthlyRevenue.toLocaleString()}`;
            document.getElementById('avg-order').textContent = `$${avgOrder.toFixed(2)}`;
            document.getElementById('conversion-rate').textContent = `${conversionRate}%`;

            // Load sales table
            const tbody = document.querySelector('#sales-table tbody');
            tbody.innerHTML = '';

            if (salesSnapshot.empty) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">No sales found</td></tr>';
                return;
            }

            salesSnapshot.forEach(doc => {
                const sale = doc.data();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${doc.id}</td>
                    <td>${sale.customerName || 'N/A'}</td>
                    <td>${sale.sellerName || 'N/A'}</td>
                    <td>$${sale.amount || 0}</td>
                    <td><span class="badge ${sale.status || 'completed'}">${sale.status || 'completed'}</span></td>
                    <td>${this.formatDate(sale.timestamp)}</td>
                `;
                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error loading sales data:', error);
            this.showNotification('Error loading sales data', 'error');
        }
    }

    async loadContentData() {
        try {
            // Mock content statistics
            document.getElementById('total-pages').textContent = '12';
            document.getElementById('total-media').textContent = '156';
            document.getElementById('storage-used').textContent = '2.4 GB';

            // Load pages table
            const pages = [
                { name: 'Home', url: '/', status: 'active', lastModified: new Date() },
                { name: 'About', url: '/about', status: 'active', lastModified: new Date() },
                { name: 'Services', url: '/services', status: 'active', lastModified: new Date() },
                { name: 'Contact', url: '/contact', status: 'active', lastModified: new Date() }
            ];

            const tbody = document.querySelector('#pages-table tbody');
            tbody.innerHTML = '';

            pages.forEach(page => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${page.name}</td>
                    <td>${page.url}</td>
                    <td><span class="badge ${page.status}">${page.status}</span></td>
                    <td>${this.formatDate(page.lastModified)}</td>
                    <td>
                        <button class="btn btn-outline" onclick="editPage('${page.name}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="deletePage('${page.name}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error loading content data:', error);
            this.showNotification('Error loading content data', 'error');
        }
    }

    async loadReportsData() {
        try {
            // Mock reports data
            document.getElementById('total-reports').textContent = '24';
            document.getElementById('data-exported').textContent = '156';

        } catch (error) {
            console.error('Error loading reports data:', error);
            this.showNotification('Error loading reports data', 'error');
        }
    }

    async loadSecurityData() {
        try {
            // Mock security events
            const events = [
                { event: 'Login Success', user: 'admin@nestmate.com', ip: '192.168.1.1', timestamp: new Date(), severity: 'low' },
                { event: 'Failed Login', user: 'unknown@email.com', ip: '192.168.1.2', timestamp: new Date(Date.now() - 3600000), severity: 'medium' },
                { event: 'Password Reset', user: 'user@example.com', ip: '192.168.1.3', timestamp: new Date(Date.now() - 7200000), severity: 'low' }
            ];

            const tbody = document.querySelector('#security-events-table tbody');
            tbody.innerHTML = '';

            events.forEach(event => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${event.event}</td>
                    <td>${event.user}</td>
                    <td>${event.ip}</td>
                    <td>${this.formatDate(event.timestamp)}</td>
                    <td><span class="badge ${event.severity}">${event.severity}</span></td>
                `;
                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error loading security data:', error);
            this.showNotification('Error loading security data', 'error');
        }
    }

    initEventListeners() {
        // Search functionality
        const userSearch = document.getElementById('user-search');
        if (userSearch) {
            userSearch.addEventListener('input', (e) => {
                this.filterTable('users-table', e.target.value);
            });
        }

        const sellerSearch = document.getElementById('seller-search');
        if (sellerSearch) {
            sellerSearch.addEventListener('input', (e) => {
                this.filterTable('sellers-table', e.target.value);
            });
        }

        // Form submissions
        const addUserForm = document.getElementById('add-user-form');
        if (addUserForm) {
            addUserForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addUser();
            });
        }

        const addSellerForm = document.getElementById('add-seller-form');
        if (addSellerForm) {
            addSellerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addSeller();
            });
        }

        const generalSettingsForm = document.getElementById('general-settings-form');
        if (generalSettingsForm) {
            generalSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveGeneralSettings();
            });
        }

        const securitySettingsForm = document.getElementById('security-settings-form');
        if (securitySettingsForm) {
            securitySettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSecuritySettings();
            });
        }
    }

    filterTable(tableId, searchTerm) {
        const table = document.getElementById(tableId);
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const matches = text.includes(searchTerm.toLowerCase());
            row.style.display = matches ? '' : 'none';
        });
    }

    async addUser() {
        try {
            const userData = {
                name: document.getElementById('user-name').value,
                email: document.getElementById('user-email').value,
                role: document.getElementById('user-role').value,
                status: document.getElementById('user-status').value,
                createdAt: new Date(),
                createdBy: this.currentUser.uid
            };

            await this.db.collection('users').add(userData);
            
            this.showNotification('User added successfully', 'success');
            this.closeModal('add-user-modal');
            this.loadUsersData();
            
            // Clear form
            document.getElementById('add-user-form').reset();

        } catch (error) {
            console.error('Error adding user:', error);
            this.showNotification('Error adding user', 'error');
        }
    }

    async addSeller() {
        try {
            const sellerData = {
                businessName: document.getElementById('seller-business-name').value,
                contactPerson: document.getElementById('seller-contact').value,
                email: document.getElementById('seller-email').value,
                phone: document.getElementById('seller-phone').value,
                businessType: document.getElementById('seller-type').value,
                status: 'pending',
                verified: false,
                createdAt: new Date(),
                createdBy: this.currentUser.uid
            };

            await this.db.collection('sellers').add(sellerData);
            
            this.showNotification('Seller added successfully', 'success');
            this.closeModal('add-seller-modal');
            this.loadSellersData();
            
            // Clear form
            document.getElementById('add-seller-form').reset();

        } catch (error) {
            console.error('Error adding seller:', error);
            this.showNotification('Error adding seller', 'error');
        }
    }

    async saveGeneralSettings() {
        try {
            const settings = {
                platformName: document.getElementById('platform-name').value,
                contactEmail: document.getElementById('contact-email').value,
                maintenanceMode: document.getElementById('maintenance-mode').value === 'true',
                updatedAt: new Date(),
                updatedBy: this.currentUser.uid
            };

            await this.db.collection('settings').doc('general').set(settings);
            this.showNotification('General settings saved successfully', 'success');

        } catch (error) {
            console.error('Error saving general settings:', error);
            this.showNotification('Error saving settings', 'error');
        }
    }

    async saveSecuritySettings() {
        try {
            const settings = {
                sessionTimeout: parseInt(document.getElementById('session-timeout').value),
                passwordPolicy: document.getElementById('password-policy').value,
                twoFactorRequired: document.getElementById('2fa-required').value,
                updatedAt: new Date(),
                updatedBy: this.currentUser.uid
            };

            await this.db.collection('settings').doc('security').set(settings);
            this.showNotification('Security settings saved successfully', 'success');

        } catch (error) {
            console.error('Error saving security settings:', error);
            this.showNotification('Error saving security settings', 'error');
        }
    }

    formatDate(date) {
        if (!date) return 'N/A';
        
        const d = date instanceof Date ? date : date.toDate();
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.getElementById('notification-container').appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
}

// Global functions for modal management
function showAddUserModal() {
    document.getElementById('add-user-modal').classList.add('show');
}

function showAddSellerModal() {
    document.getElementById('add-seller-modal').classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Global functions for user management
async function editUser(userId) {
    // Implementation for editing user
    console.log('Edit user:', userId);
}

async function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await firebase.firestore().collection('users').doc(userId).delete();
            adminDashboard.showNotification('User deleted successfully', 'success');
            adminDashboard.loadUsersData();
        } catch (error) {
            console.error('Error deleting user:', error);
            adminDashboard.showNotification('Error deleting user', 'error');
        }
    }
}

// Global functions for seller management
async function editSeller(sellerId) {
    // Implementation for editing seller
    console.log('Edit seller:', sellerId);
}

async function verifySeller(sellerId) {
    try {
        await firebase.firestore().collection('sellers').doc(sellerId).update({
            verified: true,
            status: 'verified',
            verifiedAt: new Date(),
            verifiedBy: adminDashboard.currentUser.uid
        });
        adminDashboard.showNotification('Seller verified successfully', 'success');
        adminDashboard.loadSellersData();
    } catch (error) {
        console.error('Error verifying seller:', error);
        adminDashboard.showNotification('Error verifying seller', 'error');
    }
}

async function deleteSeller(sellerId) {
    if (confirm('Are you sure you want to delete this seller?')) {
        try {
            await firebase.firestore().collection('sellers').doc(sellerId).delete();
            adminDashboard.showNotification('Seller deleted successfully', 'success');
            adminDashboard.loadSellersData();
        } catch (error) {
            console.error('Error deleting seller:', error);
            adminDashboard.showNotification('Error deleting seller', 'error');
        }
    }
}

// Global functions for content management
function editPage(pageName) {
    console.log('Edit page:', pageName);
}

function deletePage(pageName) {
    if (confirm(`Are you sure you want to delete the ${pageName} page?`)) {
        console.log('Delete page:', pageName);
    }
}

// Global functions for reports
function generateReport(reportType) {
    console.log('Generate report:', reportType);
    adminDashboard.showNotification(`${reportType} report generated successfully`, 'success');
}

// Global functions for security management
function manageAdmins() {
    console.log('Manage admins');
}

function manageApiKeys() {
    console.log('Manage API keys');
}

function manageBackups() {
    console.log('Manage backups');
}

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});
