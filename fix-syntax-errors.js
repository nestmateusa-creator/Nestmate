const fs = require('fs');

const files = [
    'dashboard-basic-new.html',
    'dashboard-pro-new.html', 
    'dashboard-advanced-pro-new.html'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`Fixing syntax errors in ${file}...`);
        let content = fs.readFileSync(file, 'utf8');
        let changes = 0;
        
        // Fix malformed DynamoDB update expressions
        content = content.replace(
            /UpdateExpression: 'SET '\{([^}]+)\}/g,
            (match, data) => {
                changes++;
                // This is a complex object, let's use a simpler approach
                return `UpdateExpression: 'SET data = :data',
                ExpressionAttributeValues: {
                    ':data': {${data}}
                }`;
            }
        );
        
        // Fix missing .promise() calls
        content = content.replace(
            /dynamodb\.update\(\{([^}]+)\}\)\.then\(/g,
            (match, params) => {
                changes++;
                return `dynamodb.update({${params}}).promise().then(`;
            }
        );
        
        content = content.replace(
            /dynamodb\.put\(\{([^}]+)\}\)\.then\(/g,
            (match, params) => {
                changes++;
                return `dynamodb.put({${params}}).promise().then(`;
            }
        );
        
        // Fix malformed object literals
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
        
        // Fix remaining Firebase array operations
        content = content.replace(
            /firebase\.firestore\.FieldValue\.arrayUnion\(([^)]+)\)/g,
            (match, value) => {
                changes++;
                return `// Array append: ${value} - implement separately for DynamoDB`;
            }
        );
        
        if (changes > 0) {
            fs.writeFileSync(file, content);
            console.log(`Fixed ${changes} syntax errors in ${file}`);
        } else {
            console.log(`No syntax errors found in ${file}`);
        }
    }
});

console.log('Syntax error fixes completed!');
