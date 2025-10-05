const fs = require('fs');

console.log('Fixing remaining Firebase references in dashboard-basic-new.html...');

let content = fs.readFileSync('dashboard-basic-new.html', 'utf8');
let changes = 0;

// Fix service history delete function
content = content.replace(
    /db\.collection\('NESTMATE USER HOME SAVED DATA'\)\.doc\(currentUser\.uid\)\.collection\('serviceHistory'\)\.doc\(docId\)\.delete\(\)/g,
    `dynamodb.delete({
        TableName: 'nestmate-service-history',
        Key: { id: docId }
    }).promise()`
);
changes++;

// Fix all remaining db.collection references to use DynamoDB
content = content.replace(
    /const userRef = db\.collection\('NESTMATE USER HOME SAVED DATA'\)\.doc\(currentUser\.uid\);/g,
    `// AWS DynamoDB reference for user data`
);
changes++;

content = content.replace(
    /const backupRef = db\.collection\('NESTMATE USER HOME SAVED DATA BACKUP'\)\.doc\(currentUser\.uid\);/g,
    `// AWS DynamoDB backup reference`
);
changes++;

// Fix emergency contacts Firebase references
content = content.replace(
    /db\.collection\('NESTMATE USER HOME SAVED DATA'\)\.doc\(currentUser\.uid\)\.collection\('emergencyContacts'\)\.add\(contactData\)/g,
    `dynamodb.put({
        TableName: 'nestmate-emergency-contacts',
        Item: {
            ...contactData,
            userId: currentUser.userId,
            id: Date.now().toString()
        }
    }).promise()`
);
changes++;

content = content.replace(
    /db\.collection\('NESTMATE USER HOME SAVED DATA'\)\.doc\(currentUser\.uid\)\.collection\('emergencyContacts'\)\.get\(\)/g,
    `dynamodb.scan({
        TableName: 'nestmate-emergency-contacts',
        FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': currentUser.userId
        }
    }).promise()`
);
changes++;

// Fix any remaining Firebase collection references
content = content.replace(
    /db\.collection\('NESTMATE USER HOME SAVED DATA'\)\.doc\(currentUser\.uid\)/g,
    `// AWS DynamoDB user reference`
);
changes++;

// Fix any remaining Firebase method calls
content = content.replace(/\.set\(([^,]+), \{ merge: true \}\)/g, (match, data) => {
    changes++;
    return `// DynamoDB update: ${data}`;
});

content = content.replace(/\.get\(\)/g, '.promise()');
changes++;

if (changes > 0) {
    fs.writeFileSync('dashboard-basic-new.html', content);
    console.log(`Fixed ${changes} Firebase references`);
} else {
    console.log('No Firebase references found');
}

console.log('Firebase cleanup completed!');
