const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { userId } = JSON.parse(event.body);
        
        const dynamodb = new AWS.DynamoDB.DocumentClient();
        
        // Get all user data from DynamoDB
        const params = {
            TableName: process.env.NESTMATE_DDB_USERS_TABLE,
            Key: { userId: userId }
        };
        
        const result = await dynamodb.get(params).promise();
        const userData = result.Item;
        
        if (!userData) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'User data not found' })
            };
        }
        
        // Create comprehensive export data
        const exportData = {
            exportDate: new Date().toISOString(),
            userInfo: {
                userId: userData.userId,
                email: userData.email,
                name: userData.name,
                phone: userData.phone,
                subscription: userData.subscription,
                subscriptionStatus: userData.subscriptionStatus,
                createdAt: userData.createdAt,
                lastLogin: userData.lastLogin
            },
            homeData: {
                basicInfo: userData.basicInfo || {},
                structureInfo: userData.structureInfo || {},
                systemsInfo: userData.systemsInfo || {},
                bedroomsList: userData.bedroomsList || [],
                bathroomsInfo: userData.bathroomsInfo || {},
                kitchenInfo: userData.kitchenInfo || {},
                livingInfo: userData.livingInfo || {},
                garageInfo: userData.garageInfo || {},
                exteriorInfo: userData.exteriorInfo || {},
                appliancesInfo: userData.appliancesInfo || {},
                photos: userData.photos || [],
                floorplan: userData.floorplan || {},
                favorites: userData.favorites || [],
                emergency: userData.emergency || {}
            },
            preferences: userData.preferences || {},
            homes: userData.homes || []
        };
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="nestmate-export-${userId}-${new Date().toISOString().split('T')[0]}.json"`
            },
            body: JSON.stringify(exportData, null, 2)
        };
        
    } catch (error) {
        console.error('Data export error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to export data' })
        };
    }
};
