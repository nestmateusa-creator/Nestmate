const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.NESTMATE_AWS_REGION || 'us-east-2',
  accessKeyId: process.env.NESTMATE_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NESTMATE_AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({ signatureVersion: 'v4' });

exports.handler = async (event) => {
  try {
    const { bucket = process.env.NESTMATE_S3_BUCKET, key, contentType } = JSON.parse(event.body || '{}');
    if (!bucket || !key || !contentType) {
      return { statusCode: 400, body: JSON.stringify({ error: 'bucket, key, and contentType are required' }) };
    }

    const params = {
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      Expires: 60, // seconds
      ACL: 'public-read',
    };

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    const publicUrl = `https://${bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl, publicUrl, key, bucket }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('s3-presign error', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};


