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
            
            // If the error is because the user record doesn't exist, try to create it
            if (error.code === 'ValidationException' || error.message.includes('does not exist')) {
                console.log('🔄 User record does not exist, creating it...');
                try {
                    await this.createUserRecord(homesList);
                    console.log('✅ User record created with homes list');
                    return { success: true };
                } catch (createError) {
                    console.error('❌ Error creating user record:', createError);
                }
            }
            
            return { success: false, error: error.message };
        }
    }

    // Create user record if it doesn't exist
    async createUserRecord(homesList = []) {
        // Initialize homesData structure for per-home data storage
        const homesData = {};
        homesList.forEach(home => {
            homesData[home.id] = {
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
                systemsInfo: {}
            };
        });

        const params = {
            TableName: 'nestmate-users',
            Item: {
                userId: this.currentUserId,
                email: this.currentUserId, // Assuming userId is the email
                homesList: homesList,
                homesData: homesData, // Per-home data storage
                tasksList: [],
                preferences: {},
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        };

        console.log('🆕 Creating user record with params:', params);
        await this.dynamodb.put(params).promise();
        console.log('✅ User record created successfully');
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
            console.log('🔍 Result.Item:', result.Item);
            console.log('🔍 Result.Item?.homesList:', result.Item?.homesList);

            const homesList = result.Item ? result.Item.homesList || [] : [];
            console.log('🔍 Extracted homes list:', homesList);
            
            // If no homes found, check if user record exists at all
            if (!result.Item) {
                console.log('⚠️ No user record found in DynamoDB for userId:', this.currentUserId);
            } else if (!result.Item.homesList) {
                console.log('⚠️ User record exists but no homesList field');
            }
            
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

    async saveBedroomsList(bedroomsList, homeId = null) {
        try {
            if (!this.currentUserId) {
                console.error('❌ saveBedroomsList: User not authenticated');
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                console.warn('⚠️ saveBedroomsList: No homeId provided, using default');
                // Try to get first home or use a default
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    throw new Error('No home selected and no homes available');
                }
            }

            console.log('💾 saveBedroomsList: Saving for userId:', this.currentUserId, 'homeId:', homeId);
            console.log('💾 saveBedroomsList: Data to save:', bedroomsList);
            
            // Get current user data
            const getParams = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };
            const userData = await this.dynamodb.get(getParams).promise();
            
            // Initialize homesData if it doesn't exist
            let homesData = userData.Item?.homesData || {};
            if (!homesData[homeId]) {
                homesData[homeId] = {
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
                    systemsInfo: {}
                };
            }
            
            // Update bedroomsList for this home
            homesData[homeId].bedroomsList = bedroomsList;
            
            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET homesData = :homesData, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':homesData': homesData,
                    ':updated': new Date().toISOString()
                }
            };

            console.log('💾 saveBedroomsList: DynamoDB params:', params);
            const result = await this.dynamodb.update(params).promise();
            console.log('💾 saveBedroomsList: DynamoDB result:', result);
            console.log('✅ Bedrooms list saved to AWS for home:', homeId);
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving bedrooms list:', error);
            console.error('❌ Error details:', error.message, error.code);
            return { success: false, error: error.message };
        }
    }

    async getBedroomsList(homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    return [];
                }
            }

            console.log('🔍 getBedroomsList: Getting data for userId:', this.currentUserId, 'homeId:', homeId);
            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            const homesData = result.Item?.homesData || {};
            const bedroomsList = homesData[homeId]?.bedroomsList || [];
            
            console.log('🔍 getBedroomsList: Returning bedroomsList for home', homeId, ':', bedroomsList);
            return bedroomsList;

        } catch (error) {
            console.error('❌ Error getting bedrooms list:', error);
            return [];
        }
    }

    async saveBathroomsList(bathroomsList, homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    throw new Error('No home selected and no homes available');
                }
            }

            const getParams = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };
            const userData = await this.dynamodb.get(getParams).promise();
            
            let homesData = userData.Item?.homesData || {};
            if (!homesData[homeId]) {
                homesData[homeId] = {
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
                    systemsInfo: {}
                };
            }
            
            homesData[homeId].bathroomsList = bathroomsList;
            
            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET homesData = :homesData, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':homesData': homesData,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ Bathrooms list saved to AWS for home:', homeId);
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving bathrooms list:', error);
            return { success: false, error: error.message };
        }
    }

    async getBathroomsList(homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    return [];
                }
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            const homesData = result.Item?.homesData || {};
            return homesData[homeId]?.bathroomsList || [];

        } catch (error) {
            console.error('❌ Error getting bathrooms list:', error);
            return [];
        }
    }

    async saveKitchensList(kitchensList, homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    throw new Error('No home selected and no homes available');
                }
            }

            const getParams = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };
            const userData = await this.dynamodb.get(getParams).promise();
            
            let homesData = userData.Item?.homesData || {};
            if (!homesData[homeId]) {
                homesData[homeId] = {
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
                    systemsInfo: {}
                };
            }
            
            homesData[homeId].kitchensList = kitchensList;
            
            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET homesData = :homesData, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':homesData': homesData,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ Kitchens list saved to AWS for home:', homeId);
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving kitchens list:', error);
            return { success: false, error: error.message };
        }
    }

    async getKitchensList(homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    return [];
                }
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            const homesData = result.Item?.homesData || {};
            return homesData[homeId]?.kitchensList || [];

        } catch (error) {
            console.error('❌ Error getting kitchens list:', error);
            return [];
        }
    }

    // ==================== LIVING AREAS DATA ====================

    async saveLivingAreasList(livingAreasList, homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    throw new Error('No home selected and no homes available');
                }
            }

            const getParams = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };
            const userData = await this.dynamodb.get(getParams).promise();
            
            let homesData = userData.Item?.homesData || {};
            if (!homesData[homeId]) {
                homesData[homeId] = {
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
                    systemsInfo: {}
                };
            }
            
            homesData[homeId].livingAreasList = livingAreasList;
            
            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET homesData = :homesData, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':homesData': homesData,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ Living areas list saved to AWS for home:', homeId);
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving living areas list:', error);
            return { success: false, error: error.message };
        }
    }

    async getLivingAreasList(homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    return [];
                }
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            const homesData = result.Item?.homesData || {};
            return homesData[homeId]?.livingAreasList || [];

        } catch (error) {
            console.error('❌ Error getting living areas list:', error);
            return [];
        }
    }

    // ==================== GARAGE DATA ====================

    async saveGarageInfo(garageInfo, homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    throw new Error('No home selected and no homes available');
                }
            }

            const getParams = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };
            const userData = await this.dynamodb.get(getParams).promise();
            
            let homesData = userData.Item?.homesData || {};
            if (!homesData[homeId]) {
                homesData[homeId] = {
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
                    systemsInfo: {}
                };
            }
            
            homesData[homeId].garageInfo = garageInfo;
            
            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET homesData = :homesData, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':homesData': homesData,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ Garage info saved to AWS for home:', homeId);
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving garage info:', error);
            return { success: false, error: error.message };
        }
    }

    async getGarageInfo(homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    return {};
                }
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            const homesData = result.Item?.homesData || {};
            return homesData[homeId]?.garageInfo || {};

        } catch (error) {
            console.error('❌ Error getting garage info:', error);
            return {};
        }
    }

    // ==================== EXTERIOR DATA ====================

    async saveExteriorInfo(exteriorInfo, homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    throw new Error('No home selected and no homes available');
                }
            }

            const getParams = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };
            const userData = await this.dynamodb.get(getParams).promise();
            
            let homesData = userData.Item?.homesData || {};
            if (!homesData[homeId]) {
                homesData[homeId] = {
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
                    systemsInfo: {}
                };
            }
            
            homesData[homeId].exteriorInfo = exteriorInfo;
            
            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET homesData = :homesData, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':homesData': homesData,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ Exterior info saved to AWS for home:', homeId);
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving exterior info:', error);
            return { success: false, error: error.message };
        }
    }

    async getExteriorInfo(homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    return {};
                }
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            const homesData = result.Item?.homesData || {};
            return homesData[homeId]?.exteriorInfo || {};

        } catch (error) {
            console.error('❌ Error getting exterior info:', error);
            return {};
        }
    }

    // ==================== APPLIANCES DATA ====================

    async saveAppliancesList(appliancesList, homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    throw new Error('No home selected and no homes available');
                }
            }

            const getParams = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };
            const userData = await this.dynamodb.get(getParams).promise();
            
            let homesData = userData.Item?.homesData || {};
            if (!homesData[homeId]) {
                homesData[homeId] = {
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
                    systemsInfo: {}
                };
            }
            
            homesData[homeId].appliancesList = appliancesList;
            
            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET homesData = :homesData, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':homesData': homesData,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ Appliances list saved to AWS for home:', homeId);
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving appliances list:', error);
            return { success: false, error: error.message };
        }
    }

    async getAppliancesList(homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    return [];
                }
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            const homesData = result.Item?.homesData || {};
            return homesData[homeId]?.appliancesList || [];

        } catch (error) {
            console.error('❌ Error getting appliances list:', error);
            return [];
        }
    }

    // ==================== PHOTOS DATA ====================

    async savePhotosList(photosList, homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    throw new Error('No home selected and no homes available');
                }
            }

            const getParams = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };
            const userData = await this.dynamodb.get(getParams).promise();
            
            let homesData = userData.Item?.homesData || {};
            if (!homesData[homeId]) {
                homesData[homeId] = {
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
                    systemsInfo: {}
                };
            }
            
            homesData[homeId].photosList = photosList;
            
            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET homesData = :homesData, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':homesData': homesData,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ Photos list saved to AWS for home:', homeId);
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving photos list:', error);
            return { success: false, error: error.message };
        }
    }

    async getPhotosList(homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    return [];
                }
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            const homesData = result.Item?.homesData || {};
            return homesData[homeId]?.photosList || [];

        } catch (error) {
            console.error('❌ Error getting photos list:', error);
            return [];
        }
    }

    // ==================== RENOVATIONS DATA ====================

    async saveRenovationsList(renovationsList, homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    throw new Error('No home selected and no homes available');
                }
            }

            const getParams = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };
            const userData = await this.dynamodb.get(getParams).promise();
            
            let homesData = userData.Item?.homesData || {};
            if (!homesData[homeId]) {
                homesData[homeId] = {
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
                    systemsInfo: {}
                };
            }
            
            homesData[homeId].renovationsList = renovationsList;
            
            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET homesData = :homesData, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':homesData': homesData,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ Renovations list saved to AWS for home:', homeId);
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving renovations list:', error);
            return { success: false, error: error.message };
        }
    }

    async getRenovationsList(homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    return [];
                }
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            const homesData = result.Item?.homesData || {};
            return homesData[homeId]?.renovationsList || [];

        } catch (error) {
            console.error('❌ Error getting renovations list:', error);
            return [];
        }
    }

    // ==================== EMERGENCY CONTACTS DATA ====================

    async saveEmergencyContacts(emergencyContacts, homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    throw new Error('No home selected and no homes available');
                }
            }

            const getParams = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };
            const userData = await this.dynamodb.get(getParams).promise();
            
            let homesData = userData.Item?.homesData || {};
            if (!homesData[homeId]) {
                homesData[homeId] = {
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
                    systemsInfo: {}
                };
            }
            
            homesData[homeId].emergencyContacts = emergencyContacts;
            
            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET homesData = :homesData, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':homesData': homesData,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ Emergency contacts saved to AWS for home:', homeId);
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving emergency contacts:', error);
            return { success: false, error: error.message };
        }
    }

    async getEmergencyContacts(homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    return { family: [], emergency: [], services: [] };
                }
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            const homesData = result.Item?.homesData || {};
            return homesData[homeId]?.emergencyContacts || { family: [], emergency: [], services: [] };

        } catch (error) {
            console.error('❌ Error getting emergency contacts:', error);
            return { family: [], emergency: [], services: [] };
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

    // ==================== STRUCTURE DATA ====================

    async saveStructureInfo(structureInfo, homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    throw new Error('No home selected and no homes available');
                }
            }

            const getParams = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };
            const userData = await this.dynamodb.get(getParams).promise();
            
            let homesData = userData.Item?.homesData || {};
            if (!homesData[homeId]) {
                homesData[homeId] = {
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
                    systemsInfo: {}
                };
            }
            
            homesData[homeId].structureInfo = structureInfo;
            
            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET homesData = :homesData, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':homesData': homesData,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ Structure info saved to AWS for home:', homeId);
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving structure info:', error);
            return { success: false, error: error.message };
        }
    }

    async getStructureInfo(homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    return {};
                }
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            const homesData = result.Item?.homesData || {};
            return homesData[homeId]?.structureInfo || {};

        } catch (error) {
            console.error('❌ Error getting structure info:', error);
            return {};
        }
    }

    // ==================== SYSTEMS DATA ====================

    async saveSystemsInfo(systemsInfo, homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    throw new Error('No home selected and no homes available');
                }
            }

            const getParams = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };
            const userData = await this.dynamodb.get(getParams).promise();
            
            let homesData = userData.Item?.homesData || {};
            if (!homesData[homeId]) {
                homesData[homeId] = {
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
                    systemsInfo: {}
                };
            }
            
            homesData[homeId].systemsInfo = systemsInfo;
            
            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId },
                UpdateExpression: 'SET homesData = :homesData, updatedAt = :updated',
                ExpressionAttributeValues: {
                    ':homesData': homesData,
                    ':updated': new Date().toISOString()
                }
            };

            await this.dynamodb.update(params).promise();
            console.log('✅ Systems info saved to AWS for home:', homeId);
            return { success: true };

        } catch (error) {
            console.error('❌ Error saving systems info:', error);
            return { success: false, error: error.message };
        }
    }

    async getSystemsInfo(homeId = null) {
        try {
            if (!this.currentUserId) {
                throw new Error('User not authenticated');
            }

            if (!homeId) {
                const homes = await this.getHomesList();
                if (homes.length > 0) {
                    homeId = homes[0].id;
                } else {
                    return {};
                }
            }

            const params = {
                TableName: 'nestmate-users',
                Key: { userId: this.currentUserId }
            };

            const result = await this.dynamodb.get(params).promise();
            const homesData = result.Item?.homesData || {};
            return homesData[homeId]?.systemsInfo || {};

        } catch (error) {
            console.error('❌ Error getting systems info:', error);
            return {};
        }
    }
}

// Export for use in other files
window.AWSDataService = AWSDataService;
