const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.NESTMATE_AWS_REGION || 'us-east-2',
  accessKeyId: process.env.NESTMATE_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NESTMATE_AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({ signatureVersion: 'v4' });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { photo, userInfo } = JSON.parse(event.body);
    
    if (!photo || !userInfo) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Photo and userInfo are required' }) 
      };
    }

    // Generate presigned URL for the photo
    let photoUrl = photo.url;
    if (photo.key) {
      try {
        const presignedUrl = await s3.getSignedUrlPromise('getObject', {
          Bucket: process.env.NESTMATE_S3_BUCKET || 'nestmate-files-483954734051',
          Key: photo.key,
          Expires: 3600 // 1 hour
        });
        photoUrl = presignedUrl;
      } catch (error) {
        console.error('Error generating presigned URL:', error);
        // Fall back to original URL
      }
    }

    // Generate HTML content for PDF
    const htmlContent = generatePhotoReportHTML(photo, userInfo, photoUrl);
    
    // Return HTML content that can be printed to PDF by the browser
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="${photo.filename || 'Photo'}_Report.html"`
      },
      body: htmlContent
    };
    
  } catch (error) {
    console.error('Photo PDF generation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate photo report' })
    };
  }
};

function generatePhotoReportHTML(photo, userInfo, photoUrl) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <title>Photo Report - ${photo.filename || 'Photo'}</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
          }
          .header {
              text-align: center;
              border-bottom: 2px solid #007bff;
              padding-bottom: 20px;
              margin-bottom: 30px;
          }
          .header h1 {
              color: #007bff;
              margin: 0;
          }
          .header p {
              margin: 5px 0;
              color: #666;
          }
          .photo-section {
              text-align: center;
              margin: 30px 0;
          }
          .photo-section img {
              max-width: 100%;
              max-height: 500px;
              border: 2px solid #ddd;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin: 20px 0;
          }
          .info-item {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              border-left: 4px solid #007bff;
          }
          .info-label {
              font-weight: bold;
              color: #495057;
              margin-bottom: 5px;
          }
          .info-value {
              color: #212529;
          }
          .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 0.9em;
              border-top: 1px solid #ddd;
              padding-top: 20px;
          }
          .no-print {
              display: none;
          }
          @media print {
              body { margin: 0; }
              .no-print { display: none; }
          }
      </style>
  </head>
  <body>
      <div class="header">
          <h1>Photo Report</h1>
          <p><strong>${photo.filename || 'Photo'}</strong></p>
          <p>Generated for: ${userInfo.name} (${userInfo.email})</p>
          <p>Report Date: ${new Date().toLocaleDateString()}</p>
          <div class="no-print">
              <button onclick="window.print()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                  Print / Save as PDF
              </button>
          </div>
      </div>

      <div class="photo-section">
          <h2>Photo</h2>
          <img src="${photoUrl}" alt="${photo.filename || 'Photo'}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <div style="display:none; padding: 20px; background: #f8f9fa; border-radius: 5px; color: #666;">
              <i class="fas fa-image"></i> Image not available
          </div>
      </div>

      <div class="info-grid">
          <div class="info-item">
              <div class="info-label">File Name</div>
              <div class="info-value">${photo.filename || 'Not specified'}</div>
          </div>
          <div class="info-item">
              <div class="info-label">File Type</div>
              <div class="info-value">${photo.type || 'Not specified'}</div>
          </div>
          <div class="info-item">
              <div class="info-label">Upload Date</div>
              <div class="info-value">${new Date().toLocaleDateString()}</div>
          </div>
          <div class="info-item">
              <div class="info-label">Storage Location</div>
              <div class="info-value">AWS S3</div>
          </div>
      </div>

      <div class="footer">
          <p>This report was generated by NestMate Home Intelligence System</p>
          <p>Report generated on ${new Date().toLocaleString()}</p>
      </div>
  </body>
  </html>
  `;
}
