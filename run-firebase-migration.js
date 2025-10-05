#!/usr/bin/env node

const FirebaseUserMigrator = require('./migrate-firebase-users');
const fs = require('fs');
const path = require('path');

class FirebaseMigrationRunner {
    constructor() {
        this.migrator = new FirebaseUserMigrator();
    }

    // Load Firebase export data
    loadFirebaseExport() {
        try {
            console.log('📁 Looking for Firebase export files...');
            
            // Check for different export file formats
            const possibleFiles = [
                'firebase-users-export.json',
                'firebase-data-export.json',
                'firebase-export.json',
                'users-export.json'
            ];
            
            let exportData = null;
            let exportFile = null;
            
            for (const file of possibleFiles) {
                if (fs.existsSync(file)) {
                    console.log(`✅ Found export file: ${file}`);
                    exportData = JSON.parse(fs.readFileSync(file, 'utf8'));
                    exportFile = file;
                    break;
                }
            }
            
            if (!exportData) {
                console.log('❌ No Firebase export files found.');
                console.log('📋 Please export your Firebase data first using one of these methods:');
                console.log('   1. Firebase Console → Authentication → Export users');
                console.log('   2. Run: node export-firebase-users.js');
                console.log('   3. Manual export and save as firebase-users-export.json');
                return null;
            }
            
            return { data: exportData, file: exportFile };
            
        } catch (error) {
            console.error('❌ Error loading Firebase export:', error);
            return null;
        }
    }

    // Convert Firebase export to migration format
    convertFirebaseData(exportData, exportFile) {
        try {
            console.log('🔄 Converting Firebase data to migration format...');
            
            let users = [];
            
            // Handle different export formats
            if (exportFile.includes('users-export') || exportFile.includes('firebase-users-export')) {
                // Direct user export
                users = Array.isArray(exportData) ? exportData : [exportData];
            } else if (exportData.users) {
                // Combined export with users collection
                users = exportData.users;
            } else if (exportData.Users) {
                // Firebase Console export format
                users = exportData.Users;
            } else {
                console.log('❌ Unknown export format. Please check your export file.');
                return null;
            }
            
            console.log(`📊 Found ${users.length} users to migrate`);
            
            // Convert to migration format
            const migrationUsers = users.map((user, index) => {
                // Generate temporary password
                const tempPassword = `TempPass${index + 1}!`;
                
                return {
                    email: user.email || user.Email || user.uid,
                    displayName: user.displayName || user.DisplayName || user.name || '',
                    phoneNumber: user.phoneNumber || user.PhoneNumber || '',
                    subscription: user.subscription || 'basic',
                    createdAt: user.metadata?.creationTime || user.CreationTime || new Date().toISOString(),
                    lastLoginAt: user.metadata?.lastSignInTime || user.LastSignInTime || new Date().toISOString(),
                    tempPassword: tempPassword,
                    homes: user.homes || [],
                    tasks: user.tasks || [],
                    preferences: user.preferences || {}
                };
            });
            
            return migrationUsers;
            
        } catch (error) {
            console.error('❌ Error converting Firebase data:', error);
            return null;
        }
    }

    // Generate user notification emails
    generateNotificationEmails(migrationResults) {
        console.log('📧 Generating user notification emails...');
        
        const emailTemplate = `
Subject: NestMate Platform Upgrade - Your Account Has Been Migrated

Hi [USER_NAME],

Great news! We've successfully upgraded your NestMate account to our new, faster AWS infrastructure.

🔐 **Your New Login Details:**
- Email: [USER_EMAIL]
- Temporary Password: [TEMP_PASSWORD]
- Login URL: https://nestmateus.com

⚠️ **Important - First Login:**
1. Go to https://nestmateus.com
2. Click "Sign In"
3. Use your email and temporary password above
4. You'll be prompted to create a new password
5. Your data has been preserved and is ready to use!

✨ **What's New:**
- 3x faster performance
- Better reliability and uptime
- Enhanced security features
- Lower costs (better pricing for you)

📞 **Need Help?**
- Email: support@nestmateusa.com
- Visit: https://nestmateus.com/contact.html

Thank you for being a valued NestMate user!

Best regards,
The NestMate Team
        `;
        
        const emails = [];
        
        migrationResults.needsPasswordReset.forEach(user => {
            const email = emailTemplate
                .replace('[USER_NAME]', user.email.split('@')[0])
                .replace('[USER_EMAIL]', user.email)
                .replace('[TEMP_PASSWORD]', user.tempPassword);
            
            emails.push({
                to: user.email,
                subject: 'NestMate Platform Upgrade - Your Account Has Been Migrated',
                body: email
            });
        });
        
        // Save emails to file
        fs.writeFileSync('user-notification-emails.json', JSON.stringify(emails, null, 2));
        console.log(`✅ Generated ${emails.length} notification emails`);
        console.log('📁 Saved to: user-notification-emails.json');
        
        return emails;
    }

    // Main migration process
    async runMigration() {
        console.log('🚀 Starting Firebase to AWS Migration...\n');
        
        // Step 1: Load Firebase export
        const exportInfo = this.loadFirebaseExport();
        if (!exportInfo) {
            return;
        }
        
        // Step 2: Convert data
        const migrationUsers = this.convertFirebaseData(exportInfo.data, exportInfo.file);
        if (!migrationUsers) {
            return;
        }
        
        // Step 3: Confirm migration
        console.log(`\n⚠️  Ready to migrate ${migrationUsers.length} users to AWS Cognito.`);
        console.log('This will:');
        console.log('  ✅ Create new AWS Cognito accounts');
        console.log('  ✅ Transfer user data to DynamoDB');
        console.log('  ✅ Migrate homes and tasks');
        console.log('  ✅ Generate temporary passwords');
        console.log('\nPress Ctrl+C to cancel, or wait 5 seconds to continue...');
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Step 4: Run migration
        console.log('\n🔄 Starting migration...');
        const results = await this.migrator.migrateUsers(migrationUsers);
        
        // Step 5: Generate notifications
        if (results.needsPasswordReset.length > 0) {
            this.generateNotificationEmails(results);
        }
        
        // Step 6: Save results
        fs.writeFileSync('migration-results.json', JSON.stringify(results, null, 2));
        console.log('\n📁 Migration results saved to: migration-results.json');
        
        // Step 7: Summary
        console.log('\n🎉 Migration Complete!');
        console.log(`✅ Successfully migrated: ${results.successful.length} users`);
        console.log(`❌ Failed migrations: ${results.failed.length} users`);
        console.log(`🔐 Users needing password reset: ${results.needsPasswordReset.length} users`);
        
        if (results.failed.length > 0) {
            console.log('\n❌ Failed migrations:');
            results.failed.forEach(failure => {
                console.log(`  - ${failure.email}: ${failure.error}`);
            });
        }
        
        console.log('\n📧 Next steps:');
        console.log('1. Send notification emails to users (see user-notification-emails.json)');
        console.log('2. Monitor user logins at https://nestmateus.com');
        console.log('3. Provide support for any login issues');
        
        return results;
    }
}

// Run migration if this file is executed directly
if (require.main === module) {
    const runner = new FirebaseMigrationRunner();
    runner.runMigration().catch(error => {
        console.error('💥 Migration failed:', error);
        process.exit(1);
    });
}

module.exports = FirebaseMigrationRunner;
