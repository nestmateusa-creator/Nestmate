const fs = require('fs');
const { createCanvas, loadImage, registerFont } = require('canvas');

// Create the NestMate logo as PNG
function createNestMateLogo() {
    // Create canvas
    const canvas = createCanvas(400, 120);
    const ctx = canvas.getContext('2d');
    
    // Set background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 400, 120);
    
    // Draw house icon background circles
    ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
    ctx.beginPath();
    ctx.arc(60, 60, 38, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
    ctx.beginPath();
    ctx.arc(60, 60, 30, 0, 2 * Math.PI);
    ctx.fill();
    
    // House base gradient
    const houseGradient = ctx.createLinearGradient(30, 45, 50, 60);
    houseGradient.addColorStop(0, '#2563eb');
    houseGradient.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = houseGradient;
    ctx.fillRect(30, 45, 20, 15);
    
    // House roof gradient
    const roofGradient = ctx.createLinearGradient(25, 30, 55, 45);
    roofGradient.addColorStop(0, '#facc15');
    roofGradient.addColorStop(1, '#f59e0b');
    ctx.fillStyle = roofGradient;
    ctx.beginPath();
    ctx.moveTo(25, 45);
    ctx.lineTo(40, 30);
    ctx.lineTo(55, 45);
    ctx.closePath();
    ctx.fill();
    
    // Door
    ctx.fillStyle = 'white';
    ctx.fillRect(37, 50, 6, 10);
    
    // Windows
    ctx.fillRect(32, 48, 3, 3);
    ctx.fillRect(45, 48, 3, 3);
    
    // Command center elements (small circles)
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(40, 28, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(36, 32, 1.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(44, 32, 1.5, 0, 2 * Math.PI);
    ctx.fill();
    
    // NestMate text
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.fillStyle = '#2563eb';
    ctx.fillText('NestMate', 100, 60);
    
    // Tagline
    ctx.font = '500 14px Arial, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Your Digital Command Center', 100, 85);
    
    // Decorative line
    ctx.fillStyle = '#facc15';
    ctx.fillRect(100, 90, 60, 2);
    
    // Circuit pattern
    ctx.fillStyle = 'rgba(37, 99, 235, 0.3)';
    const circuitPositions = [
        [320, 20], [328, 20], [336, 20],
        [324, 28], [332, 28], [340, 28]
    ];
    
    circuitPositions.forEach(([x, y]) => {
        ctx.fillRect(x, y, 4, 4);
    });
    
    // Connection lines
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.3)';
    ctx.lineWidth = 1;
    const lines = [
        [322, 22, 330, 22], [330, 22, 338, 22],
        [326, 30, 334, 30], [334, 30, 342, 30],
        [324, 24, 326, 28], [332, 24, 334, 28], [340, 24, 342, 28]
    ];
    
    lines.forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    });
    
    return canvas;
}

// Create and save the logo
try {
    const canvas = createNestMateLogo();
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('nestmate-logo.png', buffer);
    console.log('✅ Logo saved as nestmate-logo.png');
    
    // Create high-resolution version
    const hdCanvas = createCanvas(800, 240);
    const hdCtx = hdCanvas.getContext('2d');
    hdCtx.scale(2, 2);
    hdCtx.drawImage(canvas, 0, 0);
    const hdBuffer = hdCanvas.toBuffer('image/png');
    fs.writeFileSync('nestmate-logo-hd.png', hdBuffer);
    console.log('✅ High-resolution logo saved as nestmate-logo-hd.png');
    
    // Create square version for favicon
    const squareCanvas = createCanvas(120, 120);
    const squareCtx = squareCanvas.getContext('2d');
    
    // Background
    squareCtx.fillStyle = '#f8fafc';
    squareCtx.fillRect(0, 0, 120, 120);
    
    // House icon centered
    const centerX = 60;
    const centerY = 60;
    
    // Background circles
    squareCtx.fillStyle = 'rgba(37, 99, 235, 0.1)';
    squareCtx.beginPath();
    squareCtx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    squareCtx.fill();
    
    squareCtx.fillStyle = 'rgba(37, 99, 235, 0.2)';
    squareCtx.beginPath();
    squareCtx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    squareCtx.fill();
    
    // House base
    const houseGradient = squareCtx.createLinearGradient(centerX-10, centerY+5, centerX+10, centerY+15);
    houseGradient.addColorStop(0, '#2563eb');
    houseGradient.addColorStop(1, '#1d4ed8');
    squareCtx.fillStyle = houseGradient;
    squareCtx.fillRect(centerX-10, centerY+5, 20, 15);
    
    // House roof
    const roofGradient = squareCtx.createLinearGradient(centerX-15, centerY-10, centerX+15, centerY+5);
    roofGradient.addColorStop(0, '#facc15');
    roofGradient.addColorStop(1, '#f59e0b');
    squareCtx.fillStyle = roofGradient;
    squareCtx.beginPath();
    squareCtx.moveTo(centerX-15, centerY+5);
    squareCtx.lineTo(centerX, centerY-10);
    squareCtx.lineTo(centerX+15, centerY+5);
    squareCtx.closePath();
    squareCtx.fill();
    
    // Door
    squareCtx.fillStyle = 'white';
    squareCtx.fillRect(centerX-3, centerY+10, 6, 10);
    
    // Windows
    squareCtx.fillRect(centerX-8, centerY+8, 3, 3);
    squareCtx.fillRect(centerX+5, centerY+8, 3, 3);
    
    // Command center elements
    squareCtx.fillStyle = '#2563eb';
    squareCtx.beginPath();
    squareCtx.arc(centerX, centerY-12, 2, 0, 2 * Math.PI);
    squareCtx.fill();
    squareCtx.beginPath();
    squareCtx.arc(centerX-4, centerY-8, 1.5, 0, 2 * Math.PI);
    squareCtx.fill();
    squareCtx.beginPath();
    squareCtx.arc(centerX+4, centerY-8, 1.5, 0, 2 * Math.PI);
    squareCtx.fill();
    
    const squareBuffer = squareCanvas.toBuffer('image/png');
    fs.writeFileSync('nestmate-logo-square.png', squareBuffer);
    console.log('✅ Square logo saved as nestmate-logo-square.png');
    
} catch (error) {
    console.error('Error creating logo:', error.message);
    console.log('Make sure you have the canvas package installed: npm install canvas');
}
