const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.NESTMATE_AWS_REGION || 'us-east-2',
  accessKeyId: process.env.NESTMATE_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NESTMATE_AWS_SECRET_ACCESS_KEY,
});

const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  const email = (event.queryStringParameters && event.queryStringParameters.email) || '';
  if (!email) return { statusCode: 400, body: 'email required' };
  try {
    const res = await cognito
      .listUsers({
        UserPoolId: process.env.NESTMATE_COGNITO_USER_POOL_ID,
        Filter: `email = "${email}"`,
        Limit: 1,
      })
      .promise();
    if (!res.Users || res.Users.length === 0) {
      return { statusCode: 200, body: JSON.stringify({ exists: false }) };
    }
    const u = res.Users[0];
    const attrs = Object.fromEntries(u.Attributes.map(a => [a.Name, a.Value]));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exists: true, status: u.UserStatus, enabled: u.Enabled, attrs }),
    };
  } catch (e) {
    return { statusCode: 200, body: JSON.stringify({ error: e.message }) };
  }
};




