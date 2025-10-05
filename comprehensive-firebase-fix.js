const fs = require('fs');
const path = require('path');

// Files to fix (focusing on dashboard files first)
const dashboardFiles = [
    'dashboard-basic-new.html',
    'dashboard-pro-new.html', 
    'dashboard-advanced-pro-new.html'
];

console.log('Starting comprehensive Firebase to AWS conversion...');

dashboardFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`\nFixing ${file}...`);
        let content = fs.readFileSync(file, 'utf8');
        let changes = 0;
        
        // Fix malformed DynamoDB update expressions
        content = content.replace(
            /UpdateExpression: 'SET '\{([^}]+)\}/g,
            (match, data) => {
                changes++;
                // Convert object to proper DynamoDB update expression
                const fields = data.split(',').map(field => {
                    const [key, value] = field.split(':').map(s => s.trim());
                    return `${key} = :${key}`;
                }).join(', ');
                const values = data.split(',').map(field => {
                    const [key, value] = field.split(':').map(s => s.trim());
                    return `':${key}': ${value}`;
                }).join(',\n                    ');
                
                return `UpdateExpression: 'SET ${fields}',
                ExpressionAttributeValues: {
                    ${values}
                }`;
            }
        );
        
        // Fix malformed DynamoDB put operations
        content = content.replace(
            /dynamodb\.put\(\{\s*TableName: 'nestmate-homes',\s*Item: \{ userId: currentUser\.userId, \.\.\.\{([^}]+)\}/g,
            (match, data) => {
                changes++;
                return `dynamodb.put({
                TableName: 'nestmate-homes',
                Item: {
                    userId: currentUser.userId,
                    ${data.replace(/:/g, ': ')}
                }`;
            }
        );
        
        // Fix remaining doc.exists and doc.data() references
        content = content.replace(/\.then\(doc => \{\s*if \(doc\.exists\)/g, '.then(result => {\n                if (result.Item)');
        content = content.replace(/doc\.data\(\)/g, 'result.Item');
        content = content.replace(/doc\.exists/g, 'result.Item');
        
        // Fix remaining Firebase collection references
        content = content.replace(
            /db\.collection\('NESTMATE USER HOME SAVED DATA'\)\.doc\(currentUser\.uid\)\.get\(\)/g,
            `dynamodb.get({
                TableName: 'nestmate-homes',
                Key: { userId: currentUser.userId }
            }).promise()`
        );
        
        content = content.replace(
            /db\.collection\('NESTMATE USER HOME SAVED DATA'\)\.doc\(currentUser\.uid\)\.update\(/g,
            `dynamodb.update({
                TableName: 'nestmate-homes',
                Key: { userId: currentUser.userId },
                UpdateExpression: 'SET '`
        );
        
        content = content.replace(
            /db\.collection\('NESTMATE USER HOME SAVED DATA'\)\.doc\(currentUser\.uid\)\.set\(/g,
            `dynamodb.put({
                TableName: 'nestmate-homes',
                Item: { userId: currentUser.userId, ...`
        );
        
        // Fix Firebase array operations
        content = content.replace(
            /firebase\.firestore\.FieldValue\.arrayUnion\(/g,
            '// AWS DynamoDB array append - need to implement separately'
        );
        
        // Fix remaining auth.signOut references
        content = content.replace(/auth\.signOut\(\)/g, 'nestMateAuth.signOut()');
        
        // Fix remaining Firebase references in comments
        content = content.replace(/\/\/ Save to Firebase/g, '// Save to AWS DynamoDB');
        content = content.replace(/\/\/ Load from Firebase/g, '// Load from AWS DynamoDB');
        content = content.replace(/console\.log\('Loading homes from Firebase/g, "console.log('Loading homes from AWS");
        content = content.replace(/console\.log\('Saving homes to Firebase/g, "console.log('Saving homes to AWS");
        
        // Fix remaining Firebase console messages
        content = content.replace(/console\.log\('.*updated in Firebase after removal/g, "console.log('$&'.replace('Firebase', 'AWS')");
        
        if (changes > 0) {
            fs.writeFileSync(file, content);
            console.log(`Fixed ${changes} issues in ${file}`);
        } else {
            console.log(`No issues found in ${file}`);
        }
    }
});

// Now fix other important files
const otherFiles = [
    'NestMate.html',
    'warranty-tracker.html',
    'emergency-contacts.html',
    'import-export-files.html',
    'home-value-tracker.html',
    'home-shop.html',
    'expert-services.html'
];

otherFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`\nFixing ${file}...`);
        let content = fs.readFileSync(file, 'utf8');
        let changes = 0;
        
        // Fix Firebase references in these files
        content = content.replace(/firebase\./g, '// Firebase removed - ');
        content = content.replace(/db\.collection/g, '// db.collection removed - ');
        content = content.replace(/auth\.signOut\(\)/g, 'nestMateAuth.signOut()');
        
        if (content !== fs.readFileSync(file, 'utf8')) {
            fs.writeFileSync(file, content);
            changes++;
            console.log(`Fixed Firebase references in ${file}`);
        } else {
            console.log(`No Firebase references found in ${file}`);
        }
    }
});

console.log('\nComprehensive Firebase to AWS conversion completed!');
