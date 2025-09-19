#!/usr/bin/env python3
"""
Convert NestMate SVG logo to PNG format
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import io
    import base64
except ImportError:
    print("Installing required packages...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw, ImageFont
    import io
    import base64

def create_nestmate_logo():
    """Create the NestMate logo as a PNG image"""
    
    # Create image with white background
    width, height = 400, 120
    img = Image.new('RGBA', (width, height), (248, 250, 252, 255))  # #f8fafc
    draw = ImageDraw.Draw(img)
    
    # Try to load Inter font, fallback to default if not available
    try:
        # Try different font paths
        font_large = ImageFont.truetype("arial.ttf", 32)
        font_small = ImageFont.truetype("arial.ttf", 14)
    except:
        try:
            font_large = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 32)
            font_small = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 14)
        except:
            font_large = ImageFont.load_default()
            font_small = ImageFont.load_default()
    
    # Draw house icon background circles
    draw.ellipse([22, 22, 98, 98], fill=(37, 99, 235, 25))  # Primary blue with opacity
    draw.ellipse([30, 30, 90, 90], fill=(37, 99, 235, 51))  # Primary blue with more opacity
    
    # Draw house base (rectangle)
    house_base = [30, 45, 50, 60]
    draw.rounded_rectangle(house_base, radius=2, fill=(37, 99, 235, 255))  # Primary blue
    
    # Draw house roof (triangle)
    roof_points = [(25, 45), (40, 30), (55, 45)]
    draw.polygon(roof_points, fill=(250, 204, 21, 255))  # Accent yellow
    
    # Draw door
    draw.rounded_rectangle([37, 50, 43, 60], radius=1, fill=(255, 255, 255, 255))
    
    # Draw windows
    draw.rounded_rectangle([32, 48, 35, 51], radius=0.5, fill=(255, 255, 255, 255))
    draw.rounded_rectangle([45, 48, 48, 51], radius=0.5, fill=(255, 255, 255, 255))
    
    # Draw command center elements (small circles)
    draw.ellipse([38, 26, 42, 30], fill=(37, 99, 235, 255))  # Top center
    draw.ellipse([34, 30, 37, 33], fill=(37, 99, 235, 255))  # Left
    draw.ellipse([43, 30, 46, 33], fill=(37, 99, 235, 255))  # Right
    
    # Draw "NestMate" text
    draw.text((100, 25), "NestMate", font=font_large, fill=(37, 99, 235, 255))
    
    # Draw tagline
    draw.text((100, 70), "Your Digital Command Center", font=font_small, fill=(100, 116, 139, 255))
    
    # Draw decorative line
    draw.rounded_rectangle([100, 90, 160, 92], radius=1, fill=(250, 204, 21, 255))
    
    # Draw circuit pattern (simplified)
    circuit_positions = [
        (320, 20), (328, 20), (336, 20),
        (324, 28), (332, 28), (340, 28)
    ]
    
    for x, y in circuit_positions:
        draw.rounded_rectangle([x, y, x+4, y+4], radius=1, fill=(37, 99, 235, 77))  # Semi-transparent
    
    # Draw connection lines
    lines = [
        (322, 22, 330, 22), (330, 22, 338, 22),
        (326, 30, 334, 30), (334, 30, 342, 30),
        (324, 24, 326, 28), (332, 24, 334, 28), (340, 24, 342, 28)
    ]
    
    for x1, y1, x2, y2 in lines:
        draw.line([x1, y1, x2, y2], fill=(37, 99, 235, 77), width=1)
    
    return img

def main():
    """Main function to create and save the logo"""
    print("Creating NestMate logo...")
    
    # Create the logo
    logo_img = create_nestmate_logo()
    
    # Save as PNG
    logo_img.save('nestmate-logo.png', 'PNG')
    print("✅ Logo saved as 'nestmate-logo.png'")
    
    # Also save a high-resolution version
    high_res = logo_img.resize((800, 240), Image.Resampling.LANCZOS)
    high_res.save('nestmate-logo-hd.png', 'PNG')
    print("✅ High-resolution logo saved as 'nestmate-logo-hd.png'")
    
    # Save a square version for favicon use
    square_size = 120
    square_img = Image.new('RGBA', (square_size, square_size), (248, 250, 252, 255))
    square_draw = ImageDraw.Draw(square_img)
    
    # Center the house icon
    house_center = square_size // 2
    square_draw.ellipse([house_center-30, house_center-30, house_center+30, house_center+30], 
                       fill=(37, 99, 235, 25))
    square_draw.ellipse([house_center-20, house_center-20, house_center+20, house_center+20], 
                       fill=(37, 99, 235, 51))
    
    # House base
    square_draw.rounded_rectangle([house_center-10, house_center+5, house_center+10, house_center+15], 
                                 radius=2, fill=(37, 99, 235, 255))
    
    # House roof
    roof_points = [(house_center-15, house_center+5), (house_center, house_center-10), (house_center+15, house_center+5)]
    square_draw.polygon(roof_points, fill=(250, 204, 21, 255))
    
    # Door
    square_draw.rounded_rectangle([house_center-3, house_center+10, house_center+3, house_center+15], 
                                 radius=1, fill=(255, 255, 255, 255))
    
    # Windows
    square_draw.rounded_rectangle([house_center-8, house_center+8, house_center-5, house_center+11], 
                                 radius=0.5, fill=(255, 255, 255, 255))
    square_draw.rounded_rectangle([house_center+5, house_center+8, house_center+8, house_center+11], 
                                 radius=0.5, fill=(255, 255, 255, 255))
    
    square_img.save('nestmate-logo-square.png', 'PNG')
    print("✅ Square logo saved as 'nestmate-logo-square.png'")

if __name__ == "__main__":
    main()
