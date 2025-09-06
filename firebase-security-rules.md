# Firebase Security Rules for NestMate

## Firestore Security Rules

Copy and paste these rules in your Firebase Console:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `nestmate-167ed`
3. Go to Firestore Database → Rules
4. Replace the existing rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own data
    match /userProfiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow sales reps to read and write their own data
    match /salesReps/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow sellers to read and write their own data
    match /SELLER USER ACCOUNTS/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read and write their own homes
    match /homes/{homeId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Allow users to read and write their own tasks
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Allow users to read and write their own reminders
    match /reminders/{reminderId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Allow users to read and write their own rooms
    match /rooms/{roomId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Allow users to read and write their own calendar settings
    match /calendarSettings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read and write their own home details
    match /homeDetails/{homeId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Allow users to read and write their own maintenance logs
    match /maintenanceLogs/{logId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Allow users to read and write their own sales data (for sales reps)
    match /salesData/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read and write their own sales rep settings
    match /salesRepSettings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read and write their own sales rep data
    match /salesRepData/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Temporary Rules (For Testing Only)

If you need to test quickly, you can use these temporary rules (less secure):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    allow read, write: if request.auth != null;
  }
}
```

## How to Apply Rules

1. Go to Firebase Console
2. Select your project
3. Go to Firestore Database
4. Click on "Rules" tab
5. Replace the existing rules with the ones above
6. Click "Publish"

## Important Notes

- The temporary rules allow any authenticated user to read/write any document
- The proper rules restrict users to only their own data
- Always use the proper rules in production
- The temporary rules are only for testing and debugging

## Testing the Rules

After applying the rules, try signing in again. The permission denied error should be resolved.
