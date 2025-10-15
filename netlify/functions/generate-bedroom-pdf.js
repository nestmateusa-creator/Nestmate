const puppeteer = require('puppeteer');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { bedroom, userInfo } = JSON.parse(event.body);
        
        // Launch browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Generate HTML content for PDF
        const htmlContent = generateBedroomReportHTML(bedroom, userInfo);
        
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        // Generate PDF
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            }
        });
        
        await browser.close();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${bedroom.name || 'Bedroom'}_Report.pdf"`
            },
            body: pdf.toString('base64'),
            isBase64Encoded: true
        };
        
    } catch (error) {
        console.error('PDF generation error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to generate PDF' })
        };
    }
};

function generateBedroomReportHTML(bedroom, userInfo) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Bedroom Report - ${bedroom.name || 'Bedroom'}</title>
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
            }
            .footer {
                margin-top: 40px;
                text-align: center;
                color: #666;
                font-size: 0.9em;
                border-top: 1px solid #ddd;
                padding-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Bedroom Report</h1>
            <p><strong>${bedroom.name || 'Bedroom'}</strong></p>
            <p>Generated for: ${userInfo.name} (${userInfo.email})</p>
            <p>Report Date: ${new Date().toLocaleDateString()}</p>
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
            ${bedroom.bedroomPhotos && bedroom.bedroomPhotos.length > 0 ? `
            <h3>Bedroom Photos</h3>
            <ul class="file-list">
                ${bedroom.bedroomPhotos.map(photo => `<li>${photo.name}</li>`).join('')}
            </ul>
            ` : ''}
            
            ${bedroom.renovationPhotos && bedroom.renovationPhotos.length > 0 ? `
            <h3>Renovation Photos</h3>
            <ul class="file-list">
                ${bedroom.renovationPhotos.map(photo => `<li>${photo.name}</li>`).join('')}
            </ul>
            ` : ''}
            
            ${bedroom.invoices && bedroom.invoices.length > 0 ? `
            <h3>Invoices & Receipts</h3>
            <ul class="file-list">
                ${bedroom.invoices.map(invoice => `<li>${invoice.name}</li>`).join('')}
            </ul>
            ` : ''}
            
            ${bedroom.workProof && bedroom.workProof.length > 0 ? `
            <h3>Work Proof & Permits</h3>
            <ul class="file-list">
                ${bedroom.workProof.map(proof => `<li>${proof.name}</li>`).join('')}
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


