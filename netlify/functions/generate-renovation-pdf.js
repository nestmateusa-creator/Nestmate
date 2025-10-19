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
    const { renovation, userInfo } = JSON.parse(event.body);
    
    if (!renovation || !userInfo) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Renovation and userInfo are required' }) 
      };
    }

    // Generate presigned URLs for all attached files
    const presignedUrls = await generatePresignedUrls(renovation);
    
    // Generate HTML content for PDF
    const htmlContent = generateRenovationReportHTML(renovation, userInfo, presignedUrls);
    
    // Return HTML content that can be printed to PDF by the browser
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="${renovation.projectName.replace(/[^a-zA-Z0-9]/g, '_')}_Report.html`
      },
      body: htmlContent
    };
    
  } catch (error) {
    console.error('Renovation PDF generation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate renovation report' })
    };
  }
};

async function generatePresignedUrls(renovation) {
  const presignedUrls = {};
  
  try {
    // Generate presigned URLs for receipts
    if (renovation.receipts && renovation.receipts.length > 0) {
      presignedUrls.receipts = [];
      for (const receipt of renovation.receipts) {
        if (receipt.key) {
          const url = await s3.getSignedUrlPromise('getObject', {
            Bucket: process.env.NESTMATE_S3_BUCKET || 'nestmate-files-483954734051',
            Key: receipt.key,
            Expires: 3600 // 1 hour
          });
          presignedUrls.receipts.push({ ...receipt, presignedUrl: url });
        }
      }
    }

    // Generate presigned URLs for photos
    if (renovation.photos && renovation.photos.length > 0) {
      presignedUrls.photos = [];
      for (const photo of renovation.photos) {
        if (photo.key) {
          const url = await s3.getSignedUrlPromise('getObject', {
            Bucket: process.env.NESTMATE_S3_BUCKET || 'nestmate-files-483954734051',
            Key: photo.key,
            Expires: 3600 // 1 hour
          });
          presignedUrls.photos.push({ ...photo, presignedUrl: url });
        }
      }
    }

    // Generate presigned URLs for permits
    if (renovation.permits && renovation.permits.length > 0) {
      presignedUrls.permits = [];
      for (const permit of renovation.permits) {
        if (permit.key) {
          const url = await s3.getSignedUrlPromise('getObject', {
            Bucket: process.env.NESTMATE_S3_BUCKET || 'nestmate-files-483954734051',
            Key: permit.key,
            Expires: 3600 // 1 hour
          });
          presignedUrls.permits.push({ ...permit, presignedUrl: url });
        }
      }
    }
  } catch (error) {
    console.error('Error generating presigned URLs:', error);
  }
  
  return presignedUrls;
}

function generateRenovationReportHTML(renovation, userInfo, presignedUrls) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8">
      <title>Renovation Report - ${renovation.projectName}</title>
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
          .project-info {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
          }
          .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin: 20px 0;
          }
          .info-item {
              background: #e9ecef;
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
          .description {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
          }
          .files-section {
              margin: 30px 0;
          }
          .file-list {
              margin: 10px 0;
          }
          .file-item {
              background: #e9ecef;
              padding: 10px;
              margin: 5px 0;
              border-radius: 5px;
              display: flex;
              justify-content: space-between;
              align-items: center;
          }
          .file-name {
              font-weight: bold;
          }
          .file-link {
              color: #007bff;
              text-decoration: none;
          }
          .file-link:hover {
              text-decoration: underline;
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
          <h1>Renovation Project Report</h1>
          <p><strong>${renovation.projectName}</strong></p>
          <p>Generated for: ${userInfo.name} (${userInfo.email})</p>
          <p>Report Date: ${new Date().toLocaleDateString()}</p>
          <div class="no-print">
              <button onclick="window.print()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                  Print / Save as PDF
              </button>
          </div>
      </div>

      <div class="project-info">
          <h2>Project Information</h2>
          <div class="info-grid">
              <div class="info-item">
                  <div class="info-label">Project Type</div>
                  <div class="info-value">${renovation.projectType}</div>
              </div>
              <div class="info-item">
                  <div class="info-label">Status</div>
                  <div class="info-value">${renovation.status}</div>
              </div>
              <div class="info-item">
                  <div class="info-label">Start Date</div>
                  <div class="info-value">${renovation.startDate}</div>
              </div>
              <div class="info-item">
                  <div class="info-label">End Date</div>
                  <div class="info-value">${renovation.endDate || 'Ongoing'}</div>
              </div>
              <div class="info-item">
                  <div class="info-label">Total Cost</div>
                  <div class="info-value">$${renovation.totalCost || '0'}</div>
              </div>
              <div class="info-item">
                  <div class="info-label">Contractor</div>
                  <div class="info-value">${renovation.contractor || 'N/A'}</div>
              </div>
          </div>
      </div>

      <div class="description">
          <h3>Project Description</h3>
          <p>${renovation.projectDescription}</p>
      </div>

      ${renovation.warrantyInfo ? `
      <div class="description">
          <h3>Warranty Information</h3>
          <p>${renovation.warrantyInfo}</p>
      </div>
      ` : ''}

      ${renovation.notes ? `
      <div class="description">
          <h3>Additional Notes</h3>
          <p>${renovation.notes}</p>
      </div>
      ` : ''}

      ${presignedUrls.receipts && presignedUrls.receipts.length > 0 ? `
      <div class="files-section">
          <h3><i class="fas fa-receipt"></i> Receipts & Invoices</h3>
          <div class="file-list">
              ${presignedUrls.receipts.map(receipt => `
                  <div class="file-item">
                      <span class="file-name">${receipt.filename}</span>
                      <a href="${receipt.presignedUrl}" class="file-link" target="_blank">View/Download</a>
                  </div>
              `).join('')}
          </div>
      </div>
      ` : ''}

      ${presignedUrls.photos && presignedUrls.photos.length > 0 ? `
      <div class="files-section">
          <h3><i class="fas fa-camera"></i> Project Photos</h3>
          <div class="file-list">
              ${presignedUrls.photos.map(photo => `
                  <div class="file-item">
                      <span class="file-name">${photo.filename}</span>
                      <a href="${photo.presignedUrl}" class="file-link" target="_blank">View/Download</a>
                  </div>
              `).join('')}
          </div>
      </div>
      ` : ''}

      ${presignedUrls.permits && presignedUrls.permits.length > 0 ? `
      <div class="files-section">
          <h3><i class="fas fa-file-contract"></i> Permits & Documents</h3>
          <div class="file-list">
              ${presignedUrls.permits.map(permit => `
                  <div class="file-item">
                      <span class="file-name">${permit.filename}</span>
                      <a href="${permit.presignedUrl}" class="file-link" target="_blank">View/Download</a>
                  </div>
              `).join('')}
          </div>
      </div>
      ` : ''}

      <div class="footer">
          <p>This report was generated by NestMate Home Intelligence System</p>
          <p>Report generated on ${new Date().toLocaleString()}</p>
      </div>
  </body>
  </html>
  `;
}
