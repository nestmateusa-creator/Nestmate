// AWS Home Profile Service
// Handles saving and retrieving home profile data from AWS DynamoDB

class AWSHomeService {
    constructor() {
        this.dynamodb = new AWS.DynamoDB.DocumentClient();
    }

    // Save home profile data to AWS
    async saveHomeProfile(userId, homeData) {
        try {
            console.log('🏠 Saving home profile to AWS...', { userId, homeData });

            const homeId = homeData.homeId || this.generateHomeId();
            
            const params = {
                TableName: 'nestmate-homes',
                Item: {
                    homeId: homeId,
                    userId: userId,
                    address: homeData.address || '',
                    city: homeData.city || '',
                    state: homeData.state || '',
                    zipCode: homeData.zipCode || '',
                    homeType: homeData.homeType || '',
                    bedrooms: homeData.bedrooms || 0,
                    bathrooms: homeData.bathrooms || 0,
                    squareFeet: homeData.squareFeet || 0,
                    yearBuilt: homeData.yearBuilt || '',
                    purchaseDate: homeData.purchaseDate || '',
                    purchasePrice: homeData.purchasePrice || 0,
                    currentValue: homeData.currentValue || 0,
                    notes: homeData.notes || '',
                    photos: homeData.photos || [],
                    rooms: homeData.rooms || [],
                    appliances: homeData.appliances || [],
                    maintenance: homeData.maintenance || [],
                    tasks: homeData.tasks || [],
                    createdAt: homeData.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            };

            await this.dynamodb.put(params).promise();
            console.log('✅ Home profile saved successfully');

            return { success: true, homeId: homeId };

        } catch (error) {
            console.error('❌ Error saving home profile:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user's homes from AWS
    async getUserHomes(userId) {
        try {
            console.log('🏠 Getting user homes from AWS...', userId);

            const params = {
                TableName: 'nestmate-homes',
                IndexName: 'userId-index',
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            };

            const result = await this.dynamodb.query(params).promise();
            console.log('✅ Retrieved homes from AWS:', result.Items.length);

            return result.Items || [];

        } catch (error) {
            console.error('❌ Error getting user homes:', error);
            return [];
        }
    }

    // Save task data to AWS
    async saveTask(userId, taskData) {
        try {
            console.log('📝 Saving task to AWS...', { userId, taskData });

            const taskId = taskData.taskId || this.generateTaskId();
            
            const params = {
                TableName: 'nestmate-tasks',
                Item: {
                    taskId: taskId,
                    userId: userId,
                    homeId: taskData.homeId || '',
                    title: taskData.title || '',
                    description: taskData.description || '',
                    priority: taskData.priority || 'medium',
                    dueDate: taskData.dueDate || '',
                    category: taskData.category || 'maintenance',
                    status: taskData.status || 'pending',
                    completedAt: taskData.completedAt || null,
                    createdAt: taskData.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            };

            await this.dynamodb.put(params).promise();
            console.log('✅ Task saved successfully');

            return { success: true, taskId: taskId };

        } catch (error) {
            console.error('❌ Error saving task:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user's tasks from AWS
    async getUserTasks(userId) {
        try {
            console.log('📝 Getting user tasks from AWS...', userId);

            const params = {
                TableName: 'nestmate-tasks',
                IndexName: 'userId-index',
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            };

            const result = await this.dynamodb.query(params).promise();
            console.log('✅ Retrieved tasks from AWS:', result.Items.length);

            return result.Items || [];

        } catch (error) {
            console.error('❌ Error getting user tasks:', error);
            return [];
        }
    }

    // Save room data (bedrooms, bathrooms, kitchen)
    async saveRoom(userId, homeId, roomData) {
        try {
            console.log('🚪 Saving room data to AWS...', { userId, homeId, roomData });

            const roomId = roomData.roomId || this.generateRoomId();
            
            const params = {
                TableName: 'nestmate-rooms',
                Item: {
                    roomId: roomId,
                    userId: userId,
                    homeId: homeId,
                    roomType: roomData.roomType || 'bedroom',
                    name: roomData.name || '',
                    description: roomData.description || '',
                    fixtures: roomData.fixtures || '',
                    flooring: roomData.flooring || '',
                    wallColor: roomData.wallColor || '',
                    ventilation: roomData.ventilation || '',
                    lastRenovation: roomData.lastRenovation || '',
                    condition: roomData.condition || 'good',
                    photos: roomData.photos || [],
                    notes: roomData.notes || '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            };

            await this.dynamodb.put(params).promise();
            console.log('✅ Room saved successfully');

            return { success: true, roomId: roomId };

        } catch (error) {
            console.error('❌ Error saving room:', error);
            return { success: false, error: error.message };
        }
    }

    // Get rooms for a home
    async getHomeRooms(userId, homeId) {
        try {
            console.log('🚪 Getting home rooms from AWS...', { userId, homeId });

            const params = {
                TableName: 'nestmate-rooms',
                IndexName: 'homeId-index',
                KeyConditionExpression: 'homeId = :homeId',
                FilterExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':homeId': homeId,
                    ':userId': userId
                }
            };

            const result = await this.dynamodb.query(params).promise();
            console.log('✅ Retrieved rooms from AWS:', result.Items.length);

            return result.Items || [];

        } catch (error) {
            console.error('❌ Error getting home rooms:', error);
            return [];
        }
    }

    // Sync localStorage data to AWS
    async syncLocalDataToAWS(userId) {
        try {
            console.log('🔄 Syncing localStorage data to AWS...', userId);

            // Get data from localStorage
            const homesData = JSON.parse(localStorage.getItem('homesList') || '[]');
            const tasksData = JSON.parse(localStorage.getItem('tasksList') || '[]');
            const bedroomsData = JSON.parse(localStorage.getItem('bedroomsList') || '[]');
            const bathroomsData = JSON.parse(localStorage.getItem('bathroomsList') || '[]');
            const kitchensData = JSON.parse(localStorage.getItem('kitchensList') || '[]');

            // Save homes
            for (const home of homesData) {
                await this.saveHomeProfile(userId, home);
            }

            // Save tasks
            for (const task of tasksData) {
                await this.saveTask(userId, task);
            }

            // Save rooms (bedrooms, bathrooms, kitchens)
            for (const bedroom of bedroomsData) {
                await this.saveRoom(userId, bedroom.homeId || 'default', { ...bedroom, roomType: 'bedroom' });
            }

            for (const bathroom of bathroomsData) {
                await this.saveRoom(userId, bathroom.homeId || 'default', { ...bathroom, roomType: 'bathroom' });
            }

            for (const kitchen of kitchensData) {
                await this.saveRoom(userId, kitchen.homeId || 'default', { ...kitchen, roomType: 'kitchen' });
            }

            console.log('✅ LocalStorage data synced to AWS successfully');
            return { success: true };

        } catch (error) {
            console.error('❌ Error syncing data to AWS:', error);
            return { success: false, error: error.message };
        }
    }

    // Generate unique IDs
    generateHomeId() {
        return 'home_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateTaskId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateRoomId() {
        return 'room_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Export for use in other files
window.AWSHomeService = AWSHomeService;
