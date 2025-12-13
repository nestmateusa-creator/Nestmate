// Demo Auth - Mock authentication for demo dashboards
// Always returns authenticated state without requiring actual login

class DemoAuth {
    constructor() {
        this.currentUser = {
            userId: 'demo-user',
            email: 'demo@nestmate.com',
            username: 'demo@nestmate.com',
            name: 'Demo User'
        };
        this.initialized = true;
    }

    async initialize() {
        console.log('🎭 Demo Auth initialized');
        return Promise.resolve();
    }

    async isAuthenticated() {
        // Always return true in demo mode
        return Promise.resolve(true);
    }

    async getCurrentUser() {
        return Promise.resolve(this.currentUser);
    }

    async signOut() {
        // In demo mode, just redirect to demo access page
        window.location.href = 'demo-access.html';
        return Promise.resolve();
    }

    async signIn(email, password) {
        // Not used in demo mode, but return success for compatibility
        return Promise.resolve({ success: true, user: this.currentUser });
    }

    async signUp(email, password, name) {
        // Not used in demo mode, but return success for compatibility
        return Promise.resolve({ success: true, user: this.currentUser });
    }
}

// Create global instance
window.nestMateAuth = new DemoAuth();

