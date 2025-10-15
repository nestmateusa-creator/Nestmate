const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { bedroom, userInfo } = JSON.parse(event.body);
        
        // Configure AWS
        AWS.config.update({
            accessKeyId: process.env.NESTMATE_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NESTMATE_AWS_SECRET_ACCESS_KEY,
            region: process.env.NESTMATE_AWS_REGION
        });
        
        const s3 = new AWS.S3();
        
        // Debug logging
        console.log('Bedroom data received:', JSON.stringify(bedroom, null, 2));
        console.log('Bedroom photos:', bedroom.bedroomPhotos);
        console.log('Renovation photos:', bedroom.renovationPhotos);
        console.log('Invoices:', bedroom.invoices);
        console.log('Work proof:', bedroom.workProof);
        
        // Check if files exist and have proper structure
        if (bedroom.bedroomPhotos && bedroom.bedroomPhotos.length > 0) {
            console.log('First bedroom photo:', bedroom.bedroomPhotos[0]);
            console.log('Bedroom photo key:', bedroom.bedroomPhotos[0].key);
        }
        if (bedroom.renovationPhotos && bedroom.renovationPhotos.length > 0) {
            console.log('First renovation photo:', bedroom.renovationPhotos[0]);
            console.log('Renovation photo key:', bedroom.renovationPhotos[0].key);
        }
        if (bedroom.invoices && bedroom.invoices.length > 0) {
            console.log('First invoice:', bedroom.invoices[0]);
            console.log('Invoice key:', bedroom.invoices[0].key);
        }
        if (bedroom.workProof && bedroom.workProof.length > 0) {
            console.log('First work proof:', bedroom.workProof[0]);
            console.log('Work proof key:', bedroom.workProof[0].key);
        }
        
        // Generate presigned URLs for files
        const bedroomWithUrls = await generatePresignedUrls(bedroom, s3);
        
        // Generate HTML content for PDF
        const htmlContent = generateBedroomReportHTML(bedroomWithUrls, userInfo);
        
        // Return HTML content that can be printed to PDF by the browser
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html',
                'Content-Disposition': `inline; filename="${bedroom.name || 'Bedroom'}_Report.html"`
            },
            body: htmlContent
        };
        
    } catch (error) {
        console.error('PDF generation error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to generate report' })
        };
    }
};

async function generatePresignedUrls(bedroom, s3) {
    const bucketName = process.env.NESTMATE_S3_BUCKET || 'nestmate-files-483954734051';
    const bedroomWithUrls = { ...bedroom };
    
    // Generate presigned URLs for bedroom photos
    if (bedroom.bedroomPhotos && bedroom.bedroomPhotos.length > 0) {
        bedroomWithUrls.bedroomPhotos = await Promise.all(
            bedroom.bedroomPhotos.map(async (photo) => {
                const fileKey = photo.key || photo.fileKey || photo;
                console.log('Processing bedroom photo:', photo.name, 'with key:', fileKey);
                if (fileKey && fileKey !== 'undefined') {
                    try {
                        const presignedUrl = s3.getSignedUrl('getObject', {
                            Bucket: bucketName,
                            Key: fileKey,
                            Expires: 3600 // 1 hour
                        });
                        console.log('Generated presigned URL for bedroom photo:', presignedUrl.substring(0, 100) + '...');
                        console.log('Full presigned URL:', presignedUrl);
                        return { ...photo, presignedUrl };
                    } catch (error) {
                        console.error('Error generating presigned URL for bedroom photo:', error);
                        return photo;
                    }
                }
                console.warn('Skipping bedroom photo due to invalid key:', fileKey);
                return photo;
            })
        );
    }
    
    // Generate presigned URLs for renovation photos
    if (bedroom.renovationPhotos && bedroom.renovationPhotos.length > 0) {
        bedroomWithUrls.renovationPhotos = await Promise.all(
            bedroom.renovationPhotos.map(async (photo) => {
                const fileKey = photo.key || photo.fileKey || photo;
                if (fileKey && fileKey !== 'undefined') {
                    try {
                        const presignedUrl = s3.getSignedUrl('getObject', {
                            Bucket: bucketName,
                            Key: fileKey,
                            Expires: 3600 // 1 hour
                        });
                        return { ...photo, presignedUrl };
                    } catch (error) {
                        console.error('Error generating presigned URL for renovation photo:', error);
                        return photo;
                    }
                }
                return photo;
            })
        );
    }
    
    // Generate presigned URLs for invoices
    if (bedroom.invoices && bedroom.invoices.length > 0) {
        bedroomWithUrls.invoices = await Promise.all(
            bedroom.invoices.map(async (invoice) => {
                const fileKey = invoice.key || invoice.fileKey || invoice;
                if (fileKey && fileKey !== 'undefined') {
                    try {
                        const presignedUrl = s3.getSignedUrl('getObject', {
                            Bucket: bucketName,
                            Key: fileKey,
                            Expires: 3600 // 1 hour
                        });
                        return { ...invoice, presignedUrl };
                    } catch (error) {
                        console.error('Error generating presigned URL for invoice:', error);
                        return invoice;
                    }
                }
                return invoice;
            })
        );
    }
    
    // Generate presigned URLs for work proof
    if (bedroom.workProof && bedroom.workProof.length > 0) {
        bedroomWithUrls.workProof = await Promise.all(
            bedroom.workProof.map(async (proof) => {
                const fileKey = proof.key || proof.fileKey || proof;
                if (fileKey && fileKey !== 'undefined') {
                    try {
                        const presignedUrl = s3.getSignedUrl('getObject', {
                            Bucket: bucketName,
                            Key: fileKey,
                            Expires: 3600 // 1 hour
                        });
                        return { ...proof, presignedUrl };
                    } catch (error) {
                        console.error('Error generating presigned URL for work proof:', error);
                        return proof;
                    }
                }
                return proof;
            })
        );
    }
    
    return bedroomWithUrls;
}

function generateBedroomReportHTML(bedroom, userInfo) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Bedroom Report - ${bedroom.name || 'Bedroom'}</title>
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
            .section {
                margin-bottom: 25px;
                page-break-inside: avoid;
            }
            .section h2 {
                color: #007bff;
                border-bottom: 1px solid #ddd;
                padding-bottom: 5px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 15px 0;
            }
            .info-item {
                background: #f8f9fa;
                padding: 10px;
                border-radius: 5px;
            }
            .info-label {
                font-weight: bold;
                color: #495057;
            }
            .info-value {
                color: #212529;
                margin-top: 5px;
            }
            .files-section {
                margin-top: 20px;
            }
            .file-list {
                list-style: none;
                padding: 0;
            }
            .file-list li {
                background: #e9ecef;
                margin: 5px 0;
                padding: 8px 12px;
                border-radius: 4px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .file-list a {
                color: #007bff;
                text-decoration: none;
                font-weight: 500;
            }
            .file-list a:hover {
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
            @media print {
                body { margin: 0; }
                .no-print { display: none; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Bedroom Report</h1>
            <p><strong>${bedroom.name || 'Bedroom'}</strong></p>
            <p>Generated for: ${userInfo.name} (${userInfo.email})</p>
            <p>Report Date: ${new Date().toLocaleDateString()}</p>
            <div class="no-print">
                <button onclick="window.print()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                    Print / Save as PDF
                </button>
            </div>
        </div>

        <div class="section">
            <h2>Basic Information</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Name</div>
                    <div class="info-value">${bedroom.name || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Size</div>
                    <div class="info-value">${bedroom.size || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Ceiling Height</div>
                    <div class="info-value">${bedroom.ceilingHeight || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Condition</div>
                    <div class="info-value">${bedroom.condition || 'Not specified'}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Flooring & Walls</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Floor Type</div>
                    <div class="info-value">${bedroom.floorType || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Floor Details</div>
                    <div class="info-value">${bedroom.floorDetails || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Wall Color</div>
                    <div class="info-value">${bedroom.wallColor || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Trim Style</div>
                    <div class="info-value">${bedroom.trimStyle || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Trim Color</div>
                    <div class="info-value">${bedroom.trimColor || 'Not specified'}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Windows & Coverings</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Window Count</div>
                    <div class="info-value">${bedroom.windowCount || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Window Sizes</div>
                    <div class="info-value">${bedroom.windowSizes || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Window Type</div>
                    <div class="info-value">${bedroom.windowType || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Blind Type</div>
                    <div class="info-value">${bedroom.blindType || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Blind Sizes</div>
                    <div class="info-value">${bedroom.blindSizes || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Curtain Style</div>
                    <div class="info-value">${bedroom.curtainStyle || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Curtain Sizes</div>
                    <div class="info-value">${bedroom.curtainSizes || 'Not specified'}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Electrical & Lighting</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Electrical Outlets</div>
                    <div class="info-value">${bedroom.outlets || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Outlet Type</div>
                    <div class="info-value">${bedroom.outletType || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Light Fixtures</div>
                    <div class="info-value">${bedroom.lights || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Lighting Type</div>
                    <div class="info-value">${bedroom.lightingType || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Ceiling Fan</div>
                    <div class="info-value">${bedroom.ceilingFan ? 'Yes' : 'No'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Fan Details</div>
                    <div class="info-value">${bedroom.fanDetails || 'Not specified'}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Closet & Bathroom</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Closet Type</div>
                    <div class="info-value">${bedroom.closetType || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Closet Size</div>
                    <div class="info-value">${bedroom.closetSize || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Closet Organization</div>
                    <div class="info-value">${bedroom.closetOrg || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Attached Bathroom</div>
                    <div class="info-value">${bedroom.attachedBath ? 'Yes' : 'No'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Bathroom Access</div>
                    <div class="info-value">${bedroom.bathAccess || 'Not specified'}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Additional Features</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Heating/Cooling</div>
                    <div class="info-value">${bedroom.hvac || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Security Features</div>
                    <div class="info-value">${bedroom.security || 'Not specified'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Last Renovation</div>
                    <div class="info-value">${bedroom.lastRenovation || 'Not specified'}</div>
                </div>
            </div>
        </div>

        ${bedroom.notes ? `
        <div class="section">
            <h2>Notes</h2>
            <div class="info-item">
                <div class="info-value">${bedroom.notes}</div>
            </div>
        </div>
        ` : ''}

        <div class="section files-section">
            <h2>Attached Files</h2>
            <p style="color: #666; font-size: 0.9em; margin-bottom: 20px;">
                <strong>Test Link:</strong> <a href="https://www.google.com" target="_blank" style="color: #007bff;">Click here to test if links work</a>
            </p>
            ${(bedroom.bedroomPhotos && bedroom.bedroomPhotos.length > 0) || (bedroom.renovationPhotos && bedroom.renovationPhotos.length > 0) || (bedroom.invoices && bedroom.invoices.length > 0) || (bedroom.workProof && bedroom.workProof.length > 0) ? '' : '<p style="color: #666; font-style: italic;">No files attached to this bedroom.</p>'}
            ${bedroom.bedroomPhotos && bedroom.bedroomPhotos.length > 0 ? `
            <h3>Bedroom Photos</h3>
            <ul class="file-list">
                ${bedroom.bedroomPhotos.map(photo => {
                    const fileName = photo.name || photo.fileName || 'Unknown file';
                    const fileUrl = photo.presignedUrl || '#';
                    return `
                    <li>
                        <a href="${fileUrl}" target="_blank" style="color: #007bff; text-decoration: none;">
                            <i class="fas fa-download"></i> ${fileName}
                        </a>
                        <span style="float: right; color: #666; font-size: 0.9em;">
                            <a href="${fileUrl}" target="_blank" style="color: #007bff; text-decoration: none;">
                                <i class="fas fa-eye"></i> View
                            </a>
                        </span>
                    </li>
                    `;
                }).join('')}
            </ul>
            ` : ''}
            
            ${bedroom.renovationPhotos && bedroom.renovationPhotos.length > 0 ? `
            <h3>Renovation Photos</h3>
            <ul class="file-list">
                ${bedroom.renovationPhotos.map(photo => {
                    const fileName = photo.name || photo.fileName || 'Unknown file';
                    const fileUrl = photo.presignedUrl || '#';
                    return `
                    <li>
                        <a href="${fileUrl}" target="_blank" style="color: #007bff; text-decoration: none;">
                            <i class="fas fa-download"></i> ${fileName}
                        </a>
                        <span style="float: right; color: #666; font-size: 0.9em;">
                            <a href="${fileUrl}" target="_blank" style="color: #007bff; text-decoration: none;">
                                <i class="fas fa-eye"></i> View
                            </a>
                        </span>
                    </li>
                    `;
                }).join('')}
            </ul>
            ` : ''}
            
            ${bedroom.invoices && bedroom.invoices.length > 0 ? `
            <h3>Invoices & Receipts</h3>
            <ul class="file-list">
                ${bedroom.invoices.map(invoice => {
                    const fileName = invoice.name || invoice.fileName || 'Unknown file';
                    const fileUrl = invoice.presignedUrl || '#';
                    return `
                    <li>
                        <a href="${fileUrl}" target="_blank" style="color: #007bff; text-decoration: none;">
                            <i class="fas fa-download"></i> ${fileName}
                        </a>
                        <span style="float: right; color: #666; font-size: 0.9em;">
                            <a href="${fileUrl}" target="_blank" style="color: #007bff; text-decoration: none;">
                                <i class="fas fa-eye"></i> View
                            </a>
                        </span>
                    </li>
                    `;
                }).join('')}
            </ul>
            ` : ''}
            
            ${bedroom.workProof && bedroom.workProof.length > 0 ? `
            <h3>Work Proof & Permits</h3>
            <ul class="file-list">
                ${bedroom.workProof.map(proof => {
                    const fileName = proof.name || proof.fileName || 'Unknown file';
                    const fileUrl = proof.presignedUrl || '#';
                    return `
                    <li>
                        <a href="${fileUrl}" target="_blank" style="color: #007bff; text-decoration: none;">
                            <i class="fas fa-download"></i> ${fileName}
                        </a>
                        <span style="float: right; color: #666; font-size: 0.9em;">
                            <a href="${fileUrl}" target="_blank" style="color: #007bff; text-decoration: none;">
                                <i class="fas fa-eye"></i> View
                            </a>
                        </span>
                    </li>
                    `;
                }).join('')}
            </ul>
            ` : ''}
        </div>

        <div class="footer">
            <p>This report was generated by NestMate Home Intelligence System</p>
            <p>Report generated on ${new Date().toLocaleString()}</p>
        </div>
    </body>
    </html>
    `;
}
