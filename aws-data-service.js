// AWS Data Service - Complete replacement for localStorage
// Handles all data persistence through AWS DynamoDB

class AWSDataService {
    constructor() {
        this.dynamodb = null;
        this.currentUserId = null;
        this.initialized = false;
    }

    // Initialize with current user
    async initialize(userId) {
        this.currentUserId = userId;
        
        // Initialize DynamoDB client when needed
        if (typeof AWS !== 'undefined') {
            this.dynamodb = new AWS.DynamoDB.DocumentClient();
            this.initialized = true;
            console.log('🔧 AWS Data Service initialized for user:', userId);
        } else {
            console.error('AWS SDK not available');
            throw new Error('AWS SDK not available');
        }
    }

    // ==================== USER DATA ====================

    async saveUserData(userData) {
        try {
            if (!this.initialized || !this.currentUserId) {
                console.warn('AWS Data Service not initialized');
                return { success: false, error: 'Service not initialized' };
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET #data = :data, updatedAt = :updated',
                ExpressionAttributeNames: {
                    '#data': 'userData'
                },
                ExpressionAttributeValues: {
                    ':data': userData,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ User data saved to AWS');
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving user data:', error);
            return { success: false, error: error.message };
        }
    }

    async getUserData() {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            return result.Item ? result.Item.userData || {} : {};

        } catch (error) {
            console.error('❌ Error getting user data:', error);
            return {};
        }
    }

    // ==================== HOMES DATA ====================

    async saveHomesList(homesList) {
        try {
            if (!this.initialized || !this.currentUserId) {
                console.warn('AWS Data Service not initialized');
                return { success: false, error: 'Service not initialized' };
            }

            console.log('💾 Saving homes list for user:', this.currentUserId);
            console.log('💾 Homes list to save:', homesList);

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET homesList = :homes, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':homes': homesList,
                    ':updated': new Date().toISOString()
                }
            };

            console.log('💾 DynamoDB update params:', params);
            const result = await this.dynamodb.update(params).promise();
            console.log('💾 DynamoDB update result:', result);

            console.log('✅ Homes list saved to AWS');
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving homes list:', error);
            return { success: false, error: error.message };
        }
    }

    async getHomesList() {
        try {
            if (!this.initialized || !this.currentUserId) {
                console.warn('AWS Data Service not initialized');
                return [];
            }

            console.log('🔍 Getting homes list for user:', this.currentUserId);

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            console.log('🔍 DynamoDB get params:', params);
            const result = await this.dynamodb.get(params).promise();
            console.log('🔍 DynamoDB get result:', result);

            const homesList = result.Item ? result.Item.homesList || [] : [];
            console.log('🔍 Extracted homes list:', homesList);
            return homesList;
        } catch (error) {
            console.error('❌ Error getting homes list:', error);
            return [];
        }
    }

    // ==================== TASKS DATA ====================

    async saveTasksList(tasksList) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET tasksList = :tasks, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':tasks': tasksList,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ Tasks list saved to AWS');
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving tasks list:', error);
            return { success: false, error: error.message };
        }
    }

    async getTasksList() {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            return result.Item ? result.Item.tasksList || [] : [];

        } catch (error) {
            console.error('❌ Error getting tasks list:', error);
            return [];
        }
    }

    // ==================== ROOMS DATA ====================

    async saveBedroomsList(bedroomsList) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET bedroomsList = :bedrooms, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':bedrooms': bedroomsList,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ Bedrooms list saved to AWS');
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving bedrooms list:', error);
            return { success: false, error: error.message };
        }
    }

    async getBedroomsList() {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            return result.Item ? result.Item.bedroomsList || [] : [];

        } catch (error) {
            console.error('❌ Error getting bedrooms list:', error);
            return [];
        }
    }

    async saveBathroomsList(bathroomsList) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET bathroomsList = :bathrooms, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':bathrooms': bathroomsList,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ Bathrooms list saved to AWS');
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving bathrooms list:', error);
            return { success: false, error: error.message };
        }
    }

    async getBathroomsList() {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            return result.Item ? result.Item.bathroomsList || [] : [];

        } catch (error) {
            console.error('❌ Error getting bathrooms list:', error);
            return [];
        }
    }

    async saveKitchensList(kitchensList) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET kitchensList = :kitchens, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':kitchens': kitchensList,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ Kitchens list saved to AWS');
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving kitchens list:', error);
            return { success: false, error: error.message };
        }
    }

    async getKitchensList() {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            return result.Item ? result.Item.kitchensList || [] : [];

        } catch (error) {
            console.error('❌ Error getting kitchens list:', error);
            return [];
        }
    }

    // ==================== DASHBOARD STATE ====================

    async saveDashboardState(state) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET dashboardState = :state, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':state': state,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ Dashboard state saved to AWS');
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving dashboard state:', error);
            return { success: false, error: error.message };
        }
    }

    async getDashboardState() {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            return result.Item ? result.Item.dashboardState || {} : {};

        } catch (error) {
            console.error('❌ Error getting dashboard state:', error);
            return {};
        }
    }

    // ==================== UTILITY FUNCTIONS ====================

    // Replace localStorage.setItem
    async setItem(key, value) {
        try {
            const state = await this.getDashboardState();
            state[key] = value;
            return await this.saveDashboardState(state);
        } catch (error) {
            console.error('❌ Error setting item:', error);
            return { success: false, error: error.message };
        }
    }

    // Replace localStorage.getItem
    async getItem(key) {
        try {
            const state = await this.getDashboardState();
            return state[key] || null;
        } catch (error) {
            console.error('❌ Error getting item:', error);
            return null;
        }
    }

    // Replace localStorage.removeItem
    async removeItem(key) {
        try {
            const state = await this.getDashboardState();
            delete state[key];
            return await this.saveDashboardState(state);
        } catch (error) {
            console.error('❌ Error removing item:', error);
            return { success: false, error: error.message };
        }
    }

    // Clear all data
    async clear() {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'REMOVE dashboardState, homesList, tasksList, bedroomsList, bathroomsList, kitchensList',
                ReturnValues: 'ALL_NEW'
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ All data cleared from AWS');
            return { success: true };

        } catch (error) {
            console.error('❌ Error clearing data:', error);
            return { success: false, error: error.message };
        }
    }
}

// Export for use in other files
window.AWSDataService = AWSDataService;
