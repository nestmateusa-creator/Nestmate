// Demo Data Service - Uses sessionStorage (no persistence, clears on tab close)
// This is a mock replacement for AWS Data Service for demo dashboards

class DemoDataService {
    constructor() {
        this.currentUserId = 'demo-user';
        this.initialized = false;
        this.storageKey = 'demo-nestmate-data';
    }

    // Initialize - always succeeds in demo mode
    async initialize(userId) {
        this.currentUserId = userId || 'demo-user';
        this.initialized = true;
        console.log('🎭 Demo Data Service initialized for user:', this.currentUserId);
        
        // Clear all demo data on every page load to ensure fresh start
        this.clearAllDemoData();
        
        // Initialize fresh demo data structure
        this.initDemoData();
    }

    // Clear all demo data - called on every page load
    clearAllDemoData() {
        try {
            // Clear sessionStorage demo data
            sessionStorage.removeItem(this.storageKey);
            // Also clear any localStorage items that might have been created
            const keysToRemove = [];
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && (key.includes('nestmate') || key.includes('demo') || key.includes('currentUser'))) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => sessionStorage.removeItem(key));
            
            // Clear localStorage items related to demo
            const localStorageKeysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('nestmate') || key.includes('demo') || key.includes('currentUser'))) {
                    localStorageKeysToRemove.push(key);
                }
            }
            localStorageKeysToRemove.forEach(key => localStorage.removeItem(key));
            
            console.log('🧹 Cleared all demo data for fresh start');
        } catch (e) {
            console.error('Error clearing demo data:', e);
        }
    }

    // Get stored data from sessionStorage
    getStoredData() {
        try {
            const data = sessionStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading demo data:', e);
            return null;
        }
    }

    // Save data to sessionStorage
    saveStoredData(data) {
        try {
            sessionStorage.setItem(this.storageKey, JSON.stringify(data));
            return { success: true };
        } catch (e) {
            console.error('Error saving demo data:', e);
            return { success: false, error: e.message };
        }
    }

    // Initialize demo data structure - EMPTY, no default data
    initDemoData() {
        const demoData = {
            userId: this.currentUserId,
            userData: {},
            homesList: [],
            tasksList: [],
            homesData: {},
            dashboardState: {
                bedroomsList: [],
                bathroomsList: [],
                kitchensList: []
            },
            preferences: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        // Only save if there's no existing data (don't overwrite if already cleared)
        const existing = this.getStoredData();
        if (!existing || Object.keys(existing).length === 0) {
            this.saveStoredData(demoData);
        }
    }

    // Get or create home data structure
    getHomeData(homeId) {
        const data = this.getStoredData();
        if (!data) {
            this.initDemoData();
            return this.getStoredData();
        }
        
        if (!data.homesData[homeId]) {
            data.homesData[homeId] = {
                bedroomsList: [],
                bathroomsList: [],
                kitchensList: [],
                livingAreasList: [],
                appliancesList: [],
                photosList: [],
                renovationsList: [],
                emergencyContacts: { family: [], emergency: [], services: [] },
                garageInfo: {},
                exteriorInfo: {},
                structureInfo: {},
                systemsInfo: {},
                basicInfo: {}
            };
            this.saveStoredData(data);
        }
        
        return data;
    }

    // ==================== USER DATA ====================

    async saveUserData(userData) {
        const data = this.getStoredData() || this.initDemoData();
        data.userData = userData;
        data.updatedAt = new Date().toISOString();
        return this.saveStoredData(data);
    }

    async getUserData() {
        const data = this.getStoredData();
        return data ? (data.userData || {}) : {};
    }

    // ==================== HOMES DATA ====================

    async saveHomesList(homesList) {
        const data = this.getStoredData() || this.initDemoData();
        data.homesList = homesList;
        data.updatedAt = new Date().toISOString();
        
        // Initialize homesData for new homes
        homesList.forEach(home => {
            if (!data.homesData[home.id]) {
                data.homesData[home.id] = {
                    bedroomsList: [],
                    bathroomsList: [],
                    kitchensList: [],
                    livingAreasList: [],
                    appliancesList: [],
                    photosList: [],
                    renovationsList: [],
                    emergencyContacts: { family: [], emergency: [], services: [] },
                    garageInfo: {},
                    exteriorInfo: {},
                    structureInfo: {},
                    systemsInfo: {},
                    basicInfo: {}
                };
            }
        });
        
        return this.saveStoredData(data);
    }

    async getHomesList() {
        const data = this.getStoredData();
        return data ? (data.homesList || []) : [];
    }

    // ==================== TASKS DATA ====================

    async saveTasksList(tasksList) {
        const data = this.getStoredData() || this.initDemoData();
        data.tasksList = tasksList;
        data.updatedAt = new Date().toISOString();
        return this.saveStoredData(data);
    }

    async getTasksList() {
        const data = this.getStoredData();
        return data ? (data.tasksList || []) : [];
    }

    // ==================== ROOMS DATA ====================

    async saveBedroomsList(bedroomsList, homeId = null) {
        const data = this.getHomeData(homeId || this.getDefaultHomeId());
        const targetHomeId = homeId || this.getDefaultHomeId();
        data.homesData[targetHomeId].bedroomsList = bedroomsList;
        data.updatedAt = new Date().toISOString();
        return this.saveStoredData(data);
    }

    async getBedroomsList(homeId = null) {
        const data = this.getStoredData();
        const targetHomeId = homeId || this.getDefaultHomeId();
        return data?.homesData?.[targetHomeId]?.bedroomsList || [];
    }

    async saveBathroomsList(bathroomsList, homeId = null) {
        const data = this.getHomeData(homeId || this.getDefaultHomeId());
        const targetHomeId = homeId || this.getDefaultHomeId();
        data.homesData[targetHomeId].bathroomsList = bathroomsList;
        data.updatedAt = new Date().toISOString();
        return this.saveStoredData(data);
    }

    async getBathroomsList(homeId = null) {
        const data = this.getStoredData();
        const targetHomeId = homeId || this.getDefaultHomeId();
        return data?.homesData?.[targetHomeId]?.bathroomsList || [];
    }

    async saveKitchensList(kitchensList, homeId = null) {
        const data = this.getHomeData(homeId || this.getDefaultHomeId());
        const targetHomeId = homeId || this.getDefaultHomeId();
        data.homesData[targetHomeId].kitchensList = kitchensList;
        data.updatedAt = new Date().toISOString();
        return this.saveStoredData(data);
    }

    async getKitchensList(homeId = null) {
        const data = this.getStoredData();
        const targetHomeId = homeId || this.getDefaultHomeId();
        return data?.homesData?.[targetHomeId]?.kitchensList || [];
    }

    async saveLivingAreasList(livingAreasList, homeId = null) {
        const data = this.getHomeData(homeId || this.getDefaultHomeId());
        const targetHomeId = homeId || this.getDefaultHomeId();
        data.homesData[targetHomeId].livingAreasList = livingAreasList;
        data.updatedAt = new Date().toISOString();
        return this.saveStoredData(data);
    }

    async getLivingAreasList(homeId = null) {
        const data = this.getStoredData();
        const targetHomeId = homeId || this.getDefaultHomeId();
        return data?.homesData?.[targetHomeId]?.livingAreasList || [];
    }

    async saveAppliancesList(appliancesList, homeId = null) {
        const data = this.getHomeData(homeId || this.getDefaultHomeId());
        const targetHomeId = homeId || this.getDefaultHomeId();
        data.homesData[targetHomeId].appliancesList = appliancesList;
        data.updatedAt = new Date().toISOString();
        return this.saveStoredData(data);
    }

    async getAppliancesList(homeId = null) {
        const data = this.getStoredData();
        const targetHomeId = homeId || this.getDefaultHomeId();
        return data?.homesData?.[targetHomeId]?.appliancesList || [];
    }

    async savePhotosList(photosList, homeId = null) {
        const data = this.getHomeData(homeId || this.getDefaultHomeId());
        const targetHomeId = homeId || this.getDefaultHomeId();
        data.homesData[targetHomeId].photosList = photosList;
        data.updatedAt = new Date().toISOString();
        return this.saveStoredData(data);
    }

    async getPhotosList(homeId = null) {
        const data = this.getStoredData();
        const targetHomeId = homeId || this.getDefaultHomeId();
        return data?.homesData?.[targetHomeId]?.photosList || [];
    }

    async saveRenovationsList(renovationsList, homeId = null) {
        const data = this.getHomeData(homeId || this.getDefaultHomeId());
        const targetHomeId = homeId || this.getDefaultHomeId();
        data.homesData[targetHomeId].renovationsList = renovationsList;
        data.updatedAt = new Date().toISOString();
        return this.saveStoredData(data);
    }

    async getRenovationsList(homeId = null) {
        const data = this.getStoredData();
        const targetHomeId = homeId || this.getDefaultHomeId();
        return data?.homesData?.[targetHomeId]?.renovationsList || [];
    }

    // ==================== GARAGE & EXTERIOR ====================

    async saveGarageInfo(garageInfo, homeId = null) {
        const data = this.getHomeData(homeId || this.getDefaultHomeId());
        const targetHomeId = homeId || this.getDefaultHomeId();
        data.homesData[targetHomeId].garageInfo = garageInfo;
        data.updatedAt = new Date().toISOString();
        return this.saveStoredData(data);
    }

    async getGarageInfo(homeId = null) {
        const data = this.getStoredData();
        const targetHomeId = homeId || this.getDefaultHomeId();
        return data?.homesData?.[targetHomeId]?.garageInfo || {};
    }

    async saveExteriorInfo(exteriorInfo, homeId = null) {
        const data = this.getHomeData(homeId || this.getDefaultHomeId());
        const targetHomeId = homeId || this.getDefaultHomeId();
        data.homesData[targetHomeId].exteriorInfo = exteriorInfo;
        data.updatedAt = new Date().toISOString();
        return this.saveStoredData(data);
    }

    async getExteriorInfo(homeId = null) {
        const data = this.getStoredData();
        const targetHomeId = homeId || this.getDefaultHomeId();
        return data?.homesData?.[targetHomeId]?.exteriorInfo || {};
    }

    // ==================== EMERGENCY CONTACTS ====================

    async saveEmergencyContacts(emergencyContacts, homeId = null) {
        const data = this.getHomeData(homeId || this.getDefaultHomeId());
        const targetHomeId = homeId || this.getDefaultHomeId();
        data.homesData[targetHomeId].emergencyContacts = emergencyContacts;
        data.updatedAt = new Date().toISOString();
        return this.saveStoredData(data);
    }

    async getEmergencyContacts(homeId = null) {
        const data = this.getStoredData();
        const targetHomeId = homeId || this.getDefaultHomeId();
        return data?.homesData?.[targetHomeId]?.emergencyContacts || { family: [], emergency: [], services: [] };
    }

    // ==================== BASIC INFO, STRUCTURE, SYSTEMS ====================

    async saveBasicInfo(basicInfo, homeId = null) {
        const data = this.getHomeData(homeId || this.getDefaultHomeId());
        const targetHomeId = homeId || this.getDefaultHomeId();
        data.homesData[targetHomeId].basicInfo = basicInfo;
        data.updatedAt = new Date().toISOString();
        return this.saveStoredData(data);
    }

    async getBasicInfo(homeId = null) {
        const data = this.getStoredData();
        const targetHomeId = homeId || this.getDefaultHomeId();
        return data?.homesData?.[targetHomeId]?.basicInfo || {};
    }

    async saveStructureInfo(structureInfo, homeId = null) {
        const data = this.getHomeData(homeId || this.getDefaultHomeId());
        const targetHomeId = homeId || this.getDefaultHomeId();
        data.homesData[targetHomeId].structureInfo = structureInfo;
        data.updatedAt = new Date().toISOString();
        return this.saveStoredData(data);
    }

    async getStructureInfo(homeId = null) {
        const data = this.getStoredData();
        const targetHomeId = homeId || this.getDefaultHomeId();
        return data?.homesData?.[targetHomeId]?.structureInfo || {};
    }

    async saveSystemsInfo(systemsInfo, homeId = null) {
        const data = this.getHomeData(homeId || this.getDefaultHomeId());
        const targetHomeId = homeId || this.getDefaultHomeId();
        data.homesData[targetHomeId].systemsInfo = systemsInfo;
        data.updatedAt = new Date().toISOString();
        return this.saveStoredData(data);
    }

    async getSystemsInfo(homeId = null) {
        const data = this.getStoredData();
        const targetHomeId = homeId || this.getDefaultHomeId();
        return data?.homesData?.[targetHomeId]?.systemsInfo || {};
    }

    // ==================== DASHBOARD STATE ====================

    async saveDashboardState(state) {
        const data = this.getStoredData() || this.initDemoData();
        data.dashboardState = state;
        data.updatedAt = new Date().toISOString();
        return this.saveStoredData(data);
    }

    async getDashboardState() {
        const data = this.getStoredData();
        return data ? (data.dashboardState || {}) : {};
    }

    // ==================== UTILITY METHODS ====================

    getDefaultHomeId() {
        const data = this.getStoredData();
        if (data && data.homesList && data.homesList.length > 0) {
            return data.homesList[0].id;
        }
        return 'default-home';
    }

    async getItem(key) {
        // For demo mode, use sessionStorage directly for simple key-value pairs
        // This is used by localStorage-replacement.js
        try {
            const value = sessionStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            // If not JSON, return as string
            return sessionStorage.getItem(key);
        }
    }

    async saveItem(key, value) {
        // For demo mode, save to sessionStorage directly
        // This is used by localStorage-replacement.js
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            sessionStorage.setItem(key, stringValue);
            return { success: true };
        } catch (e) {
            console.error('Error saving item:', e);
            return { success: false, error: e.message };
        }
    }

    // setItem alias for localStorage-replacement.js compatibility
    async setItem(key, value) {
        return this.saveItem(key, value);
    }
}

