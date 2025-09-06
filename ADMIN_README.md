# NestMate Admin Dashboard

A comprehensive admin panel for managing the entire NestMate platform, including users, sellers, sales, content, and system settings.

## 🚀 Features

### 📊 Dashboard Overview
- **Real-time Statistics**: View total users, sellers, sales, and revenue
- **Recent Activity**: Monitor platform activity and user actions
- **Performance Metrics**: Track growth and engagement trends

### 👥 User Management
- **User Accounts**: View, add, edit, and delete user accounts
- **Role Management**: Assign roles (user, seller, admin)
- **Status Control**: Activate, deactivate, or suspend users
- **Search & Filter**: Find users quickly with advanced search

### 🏪 Seller Management
- **Seller Verification**: Review and approve seller applications
- **Business Information**: Manage seller profiles and contact details
- **Status Tracking**: Monitor verification status and business types
- **Bulk Operations**: Perform actions on multiple sellers

### 📈 Sales Analytics
- **Sales Performance**: Track monthly sales and revenue
- **Order Management**: View all transactions and order details
- **Conversion Metrics**: Monitor conversion rates and average order values
- **Export Capabilities**: Generate sales reports and data exports

### 📝 Content Management
- **Website Pages**: Manage all website pages and content
- **Media Library**: Organize and manage media files
- **Storage Monitoring**: Track storage usage and optimize space
- **Content Status**: Control page visibility and publication status

### ⚙️ System Settings
- **General Settings**: Configure platform name, contact info, maintenance mode
- **Security Settings**: Manage session timeouts, password policies, 2FA
- **Access Control**: Configure admin permissions and user roles
- **System Health**: Monitor platform performance and status

### 📊 Reports & Analytics
- **User Activity Reports**: Generate detailed user engagement reports
- **Sales Performance Reports**: Analyze sales trends and patterns
- **System Health Reports**: Monitor platform performance metrics
- **Custom Reports**: Create and export custom analytics reports

### 🔒 Security & Monitoring
- **Security Events**: Monitor login attempts and security incidents
- **Access Control**: Manage admin users and API keys
- **Backup Management**: Configure system backups and recovery
- **Audit Logs**: Track all admin actions and system changes

## 🛠️ Setup Instructions

### Prerequisites
- Firebase project with Authentication and Firestore enabled
- Admin user account with proper role assignment
- Modern web browser with JavaScript enabled

### Installation

1. **Clone or download the project files**
   ```bash
   # Ensure all files are in your project directory
   admin-dashboard.html
   admin-login.html
   scripts/admin-dashboard.js
   scripts/firebaseconfig.js
   ```

2. **Configure Firebase**
   - Update `scripts/firebaseconfig.js` with your Firebase project credentials
   - Enable Authentication with Email/Password provider
   - Set up Firestore database with proper security rules

3. **Create Admin User**
   ```javascript
   // In Firebase Console or via Admin SDK
   // Create a user and set their role to 'admin' in Firestore
   {
     "uid": "user_id",
     "email": "admin@nestmate.com",
     "role": "admin",
     "name": "Admin User",
     "status": "active",
     "createdAt": timestamp
   }
   ```

4. **Set up Firestore Collections**
   - `users` - User accounts and roles
   - `sellers` - Seller information and verification status
   - `sales` - Sales transactions and revenue data
   - `activity` - System activity logs
   - `settings` - Platform configuration

### Security Rules

Set up proper Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin users can read/write all documents
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Regular users can only read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 Usage Guide

### Accessing the Admin Panel

1. **Navigate to Admin Login**
   ```
   http://your-domain.com/admin-login.html
   ```

2. **Enter Admin Credentials**
   - Use the email and password for your admin account
   - The system will verify admin privileges

3. **Access Dashboard**
   - Upon successful login, you'll be redirected to the admin dashboard
   - Use the sidebar navigation to access different sections

### Managing Users

1. **View Users**
   - Navigate to "Users Management" in the sidebar
   - View all registered users with their details
   - Use search and filters to find specific users

2. **Add New User**
   - Click "Add User" button
   - Fill in user details (name, email, role, status)
   - Submit to create the user account

3. **Edit User**
   - Click the edit icon next to any user
   - Modify user information and permissions
   - Save changes

4. **Delete User**
   - Click the delete icon next to any user
   - Confirm deletion in the popup dialog

### Managing Sellers

1. **Review Seller Applications**
   - Navigate to "Sellers Management"
   - View pending seller applications
   - Review business information and credentials

2. **Verify Sellers**
   - Click the verify button to approve sellers
   - Update verification status and add notes
   - Sellers will be notified of approval

3. **Manage Seller Status**
   - Activate, suspend, or deactivate sellers
   - Update business information
   - Monitor seller performance

### Sales Analytics

1. **View Sales Data**
   - Navigate to "Sales Analytics"
   - View monthly sales statistics
   - Monitor revenue trends and performance

2. **Generate Reports**
   - Use the report generation tools
   - Export data in various formats
   - Schedule automated reports

### System Settings

1. **General Settings**
   - Update platform name and contact information
   - Enable/disable maintenance mode
   - Configure basic platform settings

2. **Security Settings**
   - Set session timeout duration
   - Configure password policies
   - Enable two-factor authentication requirements

## 🔧 Customization

### Adding New Features

1. **Create New Section**
   ```javascript
   // Add new section to admin-dashboard.html
   <div id="new-section" class="content-section" style="display: none;">
     <!-- Your content here -->
   </div>
   ```

2. **Add Navigation Item**
   ```html
   <div class="nav-item">
     <a href="#new-section" class="nav-link" data-section="new-section">
       <i class="fas fa-icon"></i>
       New Section
     </a>
   </div>
   ```

3. **Implement JavaScript Logic**
   ```javascript
   // Add to admin-dashboard.js
   case 'new-section':
     await this.loadNewSectionData();
     break;
   ```

### Styling Customization

The admin dashboard uses CSS custom properties for easy theming:

```css
:root {
  --primary: #2563eb;        /* Primary brand color */
  --secondary: #64748b;      /* Secondary text color */
  --success: #10b981;        /* Success states */
  --warning: #f59e0b;        /* Warning states */
  --danger: #ef4444;         /* Error states */
  --info: #06b6d4;          /* Info states */
}
```

## 📱 Responsive Design

The admin dashboard is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile devices (320px - 767px)

## 🔒 Security Best Practices

1. **Admin Access Control**
   - Use strong passwords for admin accounts
   - Enable two-factor authentication
   - Regularly rotate admin credentials

2. **Data Protection**
   - Implement proper Firestore security rules
   - Use HTTPS for all communications
   - Regularly backup important data

3. **Monitoring**
   - Monitor admin login attempts
   - Review activity logs regularly
   - Set up alerts for suspicious activity

## 🐛 Troubleshooting

### Common Issues

1. **Login Fails**
   - Verify Firebase configuration
   - Check user role in Firestore
   - Ensure email/password are correct

2. **Data Not Loading**
   - Check Firestore security rules
   - Verify collection names and structure
   - Check browser console for errors

3. **Permissions Denied**
   - Ensure user has 'admin' role
   - Check Firestore security rules
   - Verify Firebase project configuration

### Debug Mode

Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('admin-debug', 'true');
```

## 📞 Support

For technical support or feature requests:
- Check the browser console for error messages
- Review Firebase configuration
- Ensure all dependencies are loaded correctly

## 🔄 Updates

To update the admin dashboard:
1. Backup your current configuration
2. Replace files with new versions
3. Test functionality in development environment
4. Deploy to production

## 📄 License

This admin dashboard is part of the NestMate platform and follows the same licensing terms.

---

**Note**: This admin dashboard requires proper authentication and authorization. Ensure only authorized personnel have access to admin credentials.

