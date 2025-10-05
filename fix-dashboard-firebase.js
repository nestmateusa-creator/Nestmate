const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
    'dashboard-basic-new.html',
    'dashboard-pro-new.html', 
    'dashboard-advanced-pro-new.html'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`Fixing ${file}...`);
        let content = fs.readFileSync(file, 'utf8');
        
        // Replace Firebase db.collection calls with AWS DynamoDB
        content = content.replace(
            /db\.collection\('NESTMATE USER HOME SAVED DATA'\)\.doc\(currentUser\.uid\)\.get\(\)/g,
            `dynamodb.get({
                TableName: 'nestmate-homes',
                Key: { userId: currentUser.userId }
            }).promise()`
        );
        
        content = content.replace(
            /db\.collection\('NESTMATE USER HOME SAVED DATA'\)\.doc\(currentUser\.uid\)\.set\(/g,
            `dynamodb.put({
                TableName: 'nestmate-homes',
                Item: { userId: currentUser.userId, ...`
        );
        
        content = content.replace(
            /db\.collection\('NESTMATE USER HOME SAVED DATA'\)\.doc\(currentUser\.uid\)\.update\(/g,
            `dynamodb.update({
                TableName: 'nestmate-homes',
                Key: { userId: currentUser.userId },
                UpdateExpression: 'SET '`
        );
        
        // Fix .then(doc => { if (doc.exists && doc.data()) patterns
        content = content.replace(
            /\.then\(doc => \{\s*if \(doc\.exists && doc\.data\(\)/g,
            '.then(result => {\n                if (result.Item && result.Item'
        );
        
        content = content.replace(/doc\.data\(\)/g, 'result.Item');
        
        // Fix auth.signOut() to nestMateAuth.signOut()
        content = content.replace(/auth\.signOut\(\)/g, 'nestMateAuth.signOut()');
        
        fs.writeFileSync(file, content);
        console.log(`Fixed ${file}`);
    }
});

console.log('Dashboard Firebase fixes completed!');
