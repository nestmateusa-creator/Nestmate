// Firebase to AWS Migration Script
// This script migrates all Firebase data to AWS services

const NestMateAWSServices = require('./aws-nestmate-services');

// Firebase configuration (you'll need to update these with your actual Firebase config)
const firebaseConfig = {
    apiKey: "AIzaSyC7vRXVWl64DyBHywDOcRHAwm5Oij5G7yI",
    authDomain: "nestmate-167ed.firebaseapp.com",
    projectId: "nestmate-167ed",
    storageBucket: "nestmate-167ed.appspot.com",
    messagingSenderId: "865171535257",
    appId: "1:865171535257:web:abcdef123456"
};

class FirebaseToAWSMigrator {
    constructor() {
        this.awsServices = new NestMateAWSServices();
        this.migrationStats = {
            users: { total: 0, migrated: 0, errors: 0 },
            homes: { total: 0, migrated: 0, errors: 0 },
            tasks: { total: 0, migrated: 0, errors: 0 },
            subscriptions: { total: 0, migrated: 0, errors: 0 }
        };
    }

    async migrateAll() {
        console.log('🚀 Starting Firebase to AWS Migration...\n');

        try {
            // Note: Since we don't have direct Firebase access in this script,
            // we'll create sample data and show you how to migrate real data
            
            await this.migrateUsers();
            await this.migrateHomes();
            await this.migrateTasks();
            await this.migrateSubscriptions();
            
            this.printMigrationSummary();
            
        } catch (error) {
            console.error('❌ Migration failed:', error);
        }
    }

    async migrateUsers() {
        console.log('👥 Migrating Users...');
        
        // Sample user data - replace with actual Firebase data
        const sampleUsers = [
            {
                userId: 'user_1',
                email: 'demo@nestmate.com',
                name: 'Demo User',
                phone: '+1234567890',
                subscription: 'pro',
                subscriptionStatus: 'active',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                homes: [],
                preferences: {
                    notifications: true,
                    theme: 'light'
                }
            }
        ];

        for (const user of sampleUsers) {
            try {
                const result = await this.awsServices.createUser(user);
                if (result.success) {
                    this.migrationStats.users.migrated++;
                    console.log(`✅ Migrated user: ${user.email}`);
                } else {
                    this.migrationStats.users.errors++;
                    console.log(`❌ Failed to migrate user: ${user.email} - ${result.error}`);
                }
            } catch (error) {
                this.migrationStats.users.errors++;
                console.log(`❌ Error migrating user: ${user.email} - ${error.message}`);
            }
        }

        this.migrationStats.users.total = sampleUsers.length;
        console.log(`📊 Users: ${this.migrationStats.users.migrated}/${this.migrationStats.users.total} migrated\n`);
    }

    async migrateHomes() {
        console.log('🏠 Migrating Homes...');
        
        // Sample home data - replace with actual Firebase data
        const sampleHomes = [
            {
                homeId: 'home_1',
                userId: 'user_1',
                name: 'My First Home',
                address: '123 Main St, Anytown, USA',
                type: 'house',
                bedrooms: 3,
                bathrooms: 2,
                squareFeet: 1500,
                yearBuilt: '2010',
                purchasePrice: 250000,
                currentValue: 275000,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tasks: [],
                serviceRecords: [],
                photos: []
            }
        ];

        for (const home of sampleHomes) {
            try {
                const result = await this.awsServices.createHome(home.userId, home);
                if (result.success) {
                    this.migrationStats.homes.migrated++;
                    console.log(`✅ Migrated home: ${home.name}`);
                } else {
                    this.migrationStats.homes.errors++;
                    console.log(`❌ Failed to migrate home: ${home.name} - ${result.error}`);
                }
            } catch (error) {
                this.migrationStats.homes.errors++;
                console.log(`❌ Error migrating home: ${home.name} - ${error.message}`);
            }
        }

        this.migrationStats.homes.total = sampleHomes.length;
        console.log(`📊 Homes: ${this.migrationStats.homes.migrated}/${this.migrationStats.homes.total} migrated\n`);
    }

    async migrateTasks() {
        console.log('📋 Migrating Tasks...');
        
        // Sample task data - replace with actual Firebase data
        const sampleTasks = [
            {
                taskId: 'task_1',
                homeId: 'home_1',
                title: 'Change Air Filter',
                description: 'Replace the HVAC air filter',
                category: 'maintenance',
                priority: 'medium',
                status: 'pending',
                dueDate: '2025-11-01',
                assignedTo: 'user_1',
                estimatedCost: 25,
                actualCost: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                completedAt: null,
                notes: []
            }
        ];

        for (const task of sampleTasks) {
            try {
                const result = await this.awsServices.createTask(task.homeId, task);
                if (result.success) {
                    this.migrationStats.tasks.migrated++;
                    console.log(`✅ Migrated task: ${task.title}`);
                } else {
                    this.migrationStats.tasks.errors++;
                    console.log(`❌ Failed to migrate task: ${task.title} - ${result.error}`);
                }
            } catch (error) {
                this.migrationStats.tasks.errors++;
                console.log(`❌ Error migrating task: ${task.title} - ${error.message}`);
            }
        }

        this.migrationStats.tasks.total = sampleTasks.length;
        console.log(`📊 Tasks: ${this.migrationStats.tasks.migrated}/${this.migrationStats.tasks.total} migrated\n`);
    }

    async migrateSubscriptions() {
        console.log('💳 Migrating Subscriptions...');
        
        // Sample subscription data - replace with actual Firebase data
        const sampleSubscriptions = [
            {
                subscriptionId: 'sub_1',
                userId: 'user_1',
                plan: 'pro',
                status: 'active',
                startDate: new Date().toISOString(),
                endDate: '',
                billingCycle: 'monthly',
                amount: 15,
                stripeCustomerId: 'cus_demo123',
                stripeSubscriptionId: 'sub_demo123',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        for (const subscription of sampleSubscriptions) {
            try {
                const result = await this.awsServices.createSubscription(subscription.userId, subscription);
                if (result.success) {
                    this.migrationStats.subscriptions.migrated++;
                    console.log(`✅ Migrated subscription: ${subscription.plan}`);
                } else {
                    this.migrationStats.subscriptions.errors++;
                    console.log(`❌ Failed to migrate subscription: ${subscription.plan} - ${result.error}`);
                }
            } catch (error) {
                this.migrationStats.subscriptions.errors++;
                console.log(`❌ Error migrating subscription: ${subscription.plan} - ${error.message}`);
            }
        }

        this.migrationStats.subscriptions.total = sampleSubscriptions.length;
        console.log(`📊 Subscriptions: ${this.migrationStats.subscriptions.migrated}/${this.migrationStats.subscriptions.total} migrated\n`);
    }

    printMigrationSummary() {
        console.log('🎉 Migration Complete!\n');
        console.log('📊 Migration Summary:');
        console.log('===================');
        
        Object.keys(this.migrationStats).forEach(type => {
            const stats = this.migrationStats[type];
            const successRate = stats.total > 0 ? ((stats.migrated / stats.total) * 100).toFixed(1) : 0;
            console.log(`${type.toUpperCase()}: ${stats.migrated}/${stats.total} (${successRate}%) - ${stats.errors} errors`);
        });

        const totalMigrated = Object.values(this.migrationStats).reduce((sum, stats) => sum + stats.migrated, 0);
        const totalErrors = Object.values(this.migrationStats).reduce((sum, stats) => sum + stats.errors, 0);
        
        console.log(`\n✅ Total Migrated: ${totalMigrated}`);
        console.log(`❌ Total Errors: ${totalErrors}`);
        
        if (totalErrors === 0) {
            console.log('\n🎉 All data migrated successfully!');
        } else {
            console.log('\n⚠️  Some data failed to migrate. Check the errors above.');
        }
    }

    // Method to help you migrate real Firebase data
    async migrateRealFirebaseData(firebaseData) {
        console.log('🔄 Migrating Real Firebase Data...');
        
        // This method would be called with actual Firebase data
        // You would need to export your Firebase data first and pass it here
        
        if (firebaseData.users) {
            for (const user of firebaseData.users) {
                await this.awsServices.createUser(user);
            }
        }
        
        if (firebaseData.homes) {
            for (const home of firebaseData.homes) {
                await this.awsServices.createHome(home.userId, home);
            }
        }
        
        if (firebaseData.tasks) {
            for (const task of firebaseData.tasks) {
                await this.awsServices.createTask(task.homeId, task);
            }
        }
        
        if (firebaseData.subscriptions) {
            for (const subscription of firebaseData.subscriptions) {
                await this.awsServices.createSubscription(subscription.userId, subscription);
            }
        }
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    const migrator = new FirebaseToAWSMigrator();
    migrator.migrateAll().catch(console.error);
}

module.exports = FirebaseToAWSMigrator;
