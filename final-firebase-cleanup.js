const fs = require('fs');

const files = [
    'dashboard-basic-new.html',
    'dashboard-pro-new.html', 
    'dashboard-advanced-pro-new.html'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`Final cleanup for ${file}...`);
        let content = fs.readFileSync(file, 'utf8');
        let changes = 0;
        
        // Fix all remaining malformed DynamoDB operations
        content = content.replace(
            /ExpressionAttributeValues: \{\s*([^}]+)\s*\}\)\.then\(/g,
            (match, values) => {
                changes++;
                return `ExpressionAttributeValues: {
                    ${values}
                }
            }).promise().then(`;
            }
        );
        
        // Fix remaining Firebase references in console logs
        content = content.replace(/console\.log\('Favorites saved to Firebase'\)/g, "console.log('Favorites saved to AWS')");
        content = content.replace(/console\.log\('Photos saved to Firebase'\)/g, "console.log('Photos saved to AWS')");
        content = content.replace(/console\.log\('Tasks saved to Firebase'\)/g, "console.log('Tasks saved to AWS')");
        
        // Fix remaining Firebase array operations
        content = content.replace(
            /firebase\.firestore\.FieldValue\.arrayUnion\(([^)]+)\)/g,
            (match, value) => {
                changes++;
                return `// Array append: ${value} - implement separately for DynamoDB`;
            }
        );
        
        // Fix any remaining malformed object structures
        content = content.replace(
            /Item: \{ userId: currentUser\.userId, \.\.\.\{([^}]+)\}/g,
            (match, data) => {
                changes++;
                return `Item: {
                    userId: currentUser.userId,
                    ${data.replace(/:/g, ': ')}
                }`;
            }
        );
        
        // Fix any remaining Firebase references
        content = content.replace(/\/\/ Save to Firebase/g, '// Save to AWS DynamoDB');
        content = content.replace(/\/\/ Load from Firebase/g, '// Load from AWS DynamoDB');
        
        if (changes > 0) {
            fs.writeFileSync(file, content);
            console.log(`Fixed ${changes} issues in ${file}`);
        } else {
            console.log(`No issues found in ${file}`);
        }
    }
});

console.log('Final Firebase cleanup completed!');
