/**
 * Comprehensive Amazon Product Catalog
 * All products with nestmateusa-20 affiliate links
 */

class AmazonProductCatalog {
    constructor() {
        this.affiliateTag = 'nestmateusa-20';
        this.baseUrl = 'https://www.amazon.com';
    }

    /**
     * Generate Amazon affiliate URL
     */
    generateAffiliateUrl(productName, category = '') {
        const searchQuery = encodeURIComponent(productName);
        const categoryParam = category ? `&i=${encodeURIComponent(category)}` : '';
        return `${this.baseUrl}/s?k=${searchQuery}${categoryParam}&tag=${this.affiliateTag}&ref=sr_pg_1`;
    }

    /**
     * Generate direct product affiliate URL
     */
    generateProductUrl(asin) {
        return `${this.baseUrl}/dp/${asin}?tag=${this.affiliateTag}&linkCode=ur2&camp=1789&creative=9325`;
    }

    /**
     * Comprehensive product catalog organized by categories
     */
    getProductCatalog() {
        return {
            // SMART HOME PRODUCTS
            'smart-home': [
                {
                    name: 'Amazon Echo Dot (5th Gen)',
                    description: 'Smart speaker with Alexa',
                    price: '$49.99',
                    category: 'smart-home',
                    asin: 'B09B8V1LZ3',
                    affiliateUrl: this.generateProductUrl('B09B8V1LZ3'),
                    image: 'https://m.media-amazon.com/images/I/714Rq4k05UL._AC_SL1000_.jpg',
                    rating: 4.5,
                    reviews: 125000,
                    tags: ['alexa', 'smart-speaker', 'voice-control']
                },
                {
                    name: 'Ring Video Doorbell',
                    description: 'WiFi-enabled video doorbell',
                    price: '$99.99',
                    category: 'smart-home',
                    asin: 'B08N5WRWNW',
                    affiliateUrl: this.generateProductUrl('B08N5WRWNW'),
                    image: 'https://m.media-amazon.com/images/I/51Q4V2R6TBL._AC_SL1000_.jpg',
                    rating: 4.3,
                    reviews: 45000,
                    tags: ['security', 'doorbell', 'video']
                },
                {
                    name: 'Nest Learning Thermostat',
                    description: 'Programmable smart thermostat',
                    price: '$249.99',
                    category: 'smart-home',
                    asin: 'B0131RG6VK',
                    affiliateUrl: this.generateProductUrl('B0131RG6VK'),
                    image: 'https://m.media-amazon.com/images/I/61VQwJX0QVL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 32000,
                    tags: ['thermostat', 'energy-saving', 'google']
                },
                {
                    name: 'Philips Hue Smart Bulbs',
                    description: 'Color-changing LED smart bulbs',
                    price: '$39.99',
                    category: 'smart-home',
                    asin: 'B01M9AU8MP',
                    affiliateUrl: this.generateProductUrl('B01M9AU8MP'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.2,
                    reviews: 28000,
                    tags: ['smart-lighting', 'color-changing', 'philips-hue']
                },
                {
                    name: 'Wyze Cam v3',
                    description: 'Indoor/outdoor security camera',
                    price: '$35.98',
                    category: 'smart-home',
                    asin: 'B08H8XQZ5P',
                    affiliateUrl: this.generateProductUrl('B08H8XQZ5P'),
                    image: 'https://m.media-amazon.com/images/I/61VQwJX0QVL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 67000,
                    tags: ['security-camera', 'outdoor', 'night-vision']
                },
                // New Smart Home Products
                {
                    name: 'Smart Home Hub',
                    description: 'Central control hub for smart devices',
                    price: '$79.99',
                    category: 'smart-home',
                    asin: 'B08J4C8871',
                    affiliateUrl: 'https://www.amazon.com/dp/B08J4C8871/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 8500,
                    tags: ['smart-hub', 'home-automation', 'wifi']
                },
                {
                    name: 'Smart Door Sensor',
                    description: 'Wireless door and window sensor',
                    price: '$24.99',
                    category: 'smart-home',
                    asin: 'B0BCR7M9KX',
                    affiliateUrl: 'https://www.amazon.com/dp/B0BCR7M9KX/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 3200,
                    tags: ['door-sensor', 'security', 'wireless']
                },
                {
                    name: 'Smart Motion Detector',
                    description: 'PIR motion sensor with app control',
                    price: '$19.99',
                    category: 'smart-home',
                    asin: 'B0B1X7G9J2',
                    affiliateUrl: 'https://www.amazon.com/dp/B0B1X7G9J2/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.2,
                    reviews: 2800,
                    tags: ['motion-detector', 'pir-sensor', 'smart-security']
                },
                {
                    name: 'Smart Temperature Sensor',
                    description: 'Wireless temperature and humidity monitor',
                    price: '$29.99',
                    category: 'smart-home',
                    asin: 'B08HRPDBFF',
                    affiliateUrl: 'https://www.amazon.com/dp/B08HRPDBFF/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 4200,
                    tags: ['temperature-sensor', 'humidity', 'climate-monitor']
                },
                {
                    name: 'Smart Light Switch',
                    description: 'WiFi dimmer switch with voice control',
                    price: '$34.99',
                    category: 'smart-home',
                    asin: 'B0BKH83KF9',
                    affiliateUrl: 'https://www.amazon.com/dp/B0BKH83KF9/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 5600,
                    tags: ['smart-switch', 'dimmer', 'voice-control']
                },
                {
                    name: 'Smart Outlet',
                    description: 'WiFi smart plug with energy monitoring',
                    price: '$22.99',
                    category: 'smart-home',
                    asin: 'B08HRPDYTP',
                    affiliateUrl: 'https://www.amazon.com/dp/B08HRPDYTP/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 3800,
                    tags: ['smart-outlet', 'energy-monitoring', 'wifi-plug']
                },
                {
                    name: 'Smart Smoke Detector',
                    description: 'WiFi connected smoke and CO detector',
                    price: '$89.99',
                    category: 'smart-home',
                    asin: 'B0DT9MC2Z9',
                    affiliateUrl: 'https://www.amazon.com/dp/B0DT9MC2Z9/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.6,
                    reviews: 2100,
                    tags: ['smoke-detector', 'carbon-monoxide', 'wifi-alerts']
                },
                {
                    name: 'Smart Doorbell Camera',
                    description: '1080p video doorbell with night vision',
                    price: '$129.99',
                    category: 'smart-home',
                    asin: 'B0D8SW5B2G',
                    affiliateUrl: 'https://www.amazon.com/dp/B0D8SW5B2G/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 3200,
                    tags: ['video-doorbell', 'night-vision', '1080p']
                },
                {
                    name: 'Smart Garage Door Opener',
                    description: 'WiFi garage door controller',
                    price: '$49.99',
                    category: 'smart-home',
                    asin: 'B0B12ZBHLZ',
                    affiliateUrl: 'https://www.amazon.com/dp/B0B12ZBHLZ/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.2,
                    reviews: 1800,
                    tags: ['garage-door', 'smart-controller', 'wifi']
                },
                {
                    name: 'Smart Window Blinds',
                    description: 'Motorized smart blinds with app control',
                    price: '$199.99',
                    category: 'smart-home',
                    asin: 'B0CSK5YMLV',
                    affiliateUrl: 'https://www.amazon.com/dp/B0CSK5YMLV/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 1200,
                    tags: ['smart-blinds', 'motorized', 'app-control']
                },
                {
                    name: 'Smart Air Purifier',
                    description: 'HEPA air purifier with WiFi control',
                    price: '$159.99',
                    category: 'smart-home',
                    asin: 'B0DDCS8H9S',
                    affiliateUrl: 'https://www.amazon.com/dp/B0DDCS8H9S/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.6,
                    reviews: 2800,
                    tags: ['air-purifier', 'hepa-filter', 'wifi-control']
                },
                {
                    name: 'Smart Ceiling Fan',
                    description: 'WiFi ceiling fan with dimmable light',
                    price: '$189.99',
                    category: 'smart-home',
                    asin: 'B0C3V2WGLK',
                    affiliateUrl: 'https://www.amazon.com/dp/B0C3V2WGLK/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 1500,
                    tags: ['ceiling-fan', 'dimmable-light', 'wifi-control']
                },
                {
                    name: 'Smart Water Leak Detector',
                    description: 'Wireless water leak sensor with alerts',
                    price: '$34.99',
                    category: 'smart-home',
                    asin: 'B0FGD3QLK4',
                    affiliateUrl: 'https://www.amazon.com/dp/B0FGD3QLK4/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 2200,
                    tags: ['water-leak-detector', 'flood-sensor', 'wireless-alerts']
                },
                {
                    name: 'Smart Door Lock Keypad',
                    description: 'Keyless entry keypad for existing locks',
                    price: '$79.99',
                    category: 'smart-home',
                    asin: 'B0FFBC4MV4',
                    affiliateUrl: 'https://www.amazon.com/dp/B0FFBC4MV4/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.2,
                    reviews: 1800,
                    tags: ['keypad-lock', 'keyless-entry', 'retrofit']
                },
                {
                    name: 'Smart Home Security System',
                    description: 'Complete wireless security system',
                    price: '$299.99',
                    category: 'smart-home',
                    asin: 'B01NB1OB0I',
                    affiliateUrl: 'https://www.amazon.com/dp/B01NB1OB0I/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 4500,
                    tags: ['security-system', 'wireless', 'complete-kit']
                }
            ],

            // HOME MAINTENANCE & TOOLS
            'home-maintenance': [
                {
                    name: 'Filtrete Air Filter 16x25x1',
                    description: 'High-efficiency HVAC air filter',
                    price: '$24.99',
                    category: 'home-maintenance',
                    asin: 'B0000YWF5E',
                    affiliateUrl: this.generateProductUrl('B0000YWF5E'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.6,
                    reviews: 45000,
                    tags: ['air-filter', 'hvac', 'allergies']
                },
                {
                    name: 'Gorilla Glue Clear',
                    description: 'Waterproof polyurethane glue',
                    price: '$8.99',
                    category: 'home-maintenance',
                    asin: 'B0000YWF5E',
                    affiliateUrl: this.generateProductUrl('B0000YWF5E'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.7,
                    reviews: 23000,
                    tags: ['glue', 'repairs', 'waterproof']
                },
                {
                    name: 'First Alert Smoke Detector',
                    description: 'Battery-operated smoke and CO detector',
                    price: '$34.99',
                    category: 'home-maintenance',
                    asin: 'B0000YWF5E',
                    affiliateUrl: this.generateProductUrl('B0000YWF5E'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.8,
                    reviews: 56000,
                    tags: ['smoke-detector', 'safety', 'carbon-monoxide']
                },
                {
                    name: 'DAP Alex Plus Caulk',
                    description: 'Paintable acrylic latex caulk',
                    price: '$4.97',
                    category: 'home-maintenance',
                    asin: 'B0000YWF5E',
                    affiliateUrl: this.generateProductUrl('B0000YWF5E'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 18000,
                    tags: ['caulk', 'sealant', 'paintable']
                },
                {
                    name: 'Kobalt Tool Set 227-Piece',
                    description: 'Complete home tool set',
                    price: '$99.99',
                    category: 'home-maintenance',
                    asin: 'B0000YWF5E',
                    affiliateUrl: this.generateProductUrl('B0000YWF5E'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.6,
                    reviews: 12000,
                    tags: ['tool-set', 'screwdrivers', 'wrenches']
                }
            ],

            // KITCHEN APPLIANCES
            'kitchen-appliances': [
                {
                    name: 'Instant Pot Duo 7-in-1',
                    description: 'Electric pressure cooker',
                    price: '$99.95',
                    category: 'kitchen-appliances',
                    asin: 'B00FLYWNYQ',
                    affiliateUrl: this.generateProductUrl('B00FLYWNYQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.6,
                    reviews: 89000,
                    tags: ['pressure-cooker', 'slow-cooker', 'rice-cooker']
                },
                {
                    name: 'Ninja Foodi Blender',
                    description: 'High-speed blender with smoothie cups',
                    price: '$99.99',
                    category: 'kitchen-appliances',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 34000,
                    tags: ['blender', 'smoothies', 'food-processor']
                },
                {
                    name: 'Cuisinart Coffee Maker',
                    description: 'Programmable 12-cup coffee maker',
                    price: '$79.99',
                    category: 'kitchen-appliances',
                    asin: 'B0000YWF5E',
                    affiliateUrl: this.generateProductUrl('B0000YWF5E'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 25000,
                    tags: ['coffee-maker', 'programmable', '12-cup']
                },
                {
                    name: 'Air Fryer 6 Quart',
                    description: 'Digital air fryer with touchscreen',
                    price: '$89.99',
                    category: 'kitchen-appliances',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 45000,
                    tags: ['air-fryer', 'healthy-cooking', 'oil-free']
                },
                {
                    name: 'KitchenAid Stand Mixer',
                    description: '5-quart stand mixer in red',
                    price: '$329.99',
                    category: 'kitchen-appliances',
                    asin: 'B00005UP2P',
                    affiliateUrl: this.generateProductUrl('B00005UP2P'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.8,
                    reviews: 67000,
                    tags: ['stand-mixer', 'baking', 'kitchenaid']
                }
            ],

            // OUTDOOR & GARDEN
            'outdoor-garden': [
                {
                    name: 'Outdoor String Lights 48ft',
                    description: 'LED string lights for patio',
                    price: '$19.99',
                    category: 'outdoor-garden',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 23000,
                    tags: ['string-lights', 'outdoor', 'led']
                },
                {
                    name: 'Garden Hose 50ft',
                    description: 'Heavy-duty expandable garden hose',
                    price: '$24.99',
                    category: 'outdoor-garden',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 18000,
                    tags: ['garden-hose', 'expandable', 'heavy-duty']
                },
                {
                    name: 'Outdoor Furniture Covers',
                    description: 'Weatherproof patio furniture covers',
                    price: '$39.99',
                    category: 'outdoor-garden',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.2,
                    reviews: 12000,
                    tags: ['furniture-covers', 'weatherproof', 'patio']
                },
                {
                    name: 'Solar Garden Lights',
                    description: 'LED solar pathway lights pack of 8',
                    price: '$29.99',
                    category: 'outdoor-garden',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.1,
                    reviews: 15000,
                    tags: ['solar-lights', 'pathway', 'led']
                },
                {
                    name: 'Garden Tool Set',
                    description: 'Professional garden tools 5-piece set',
                    price: '$49.99',
                    category: 'outdoor-garden',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 8000,
                    tags: ['garden-tools', 'shovel', 'rake']
                }
            ],

            // SMART LOCKS
            'smart-locks': [
                {
                    name: 'Smart Deadbolt Lock',
                    description: 'WiFi smart deadbolt with keypad and app control',
                    price: '$199.99',
                    category: 'smart-locks',
                    asin: 'B0CJXVK5S6',
                    affiliateUrl: 'https://www.amazon.com/dp/B0CJXVK5S6/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 3200,
                    tags: ['smart-deadbolt', 'keypad', 'wifi-control']
                },
                {
                    name: 'Fingerprint Smart Lock',
                    description: 'Biometric fingerprint door lock with backup key',
                    price: '$149.99',
                    category: 'smart-locks',
                    asin: 'B0DZDY3B3C',
                    affiliateUrl: 'https://www.amazon.com/dp/B0DZDY3B3C/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 2800,
                    tags: ['fingerprint-lock', 'biometric', 'keyless-entry']
                },
                {
                    name: 'Smart Lock with Camera',
                    description: 'Video door lock with 1080p camera and night vision',
                    price: '$299.99',
                    category: 'smart-locks',
                    asin: 'B0DPMV48KP',
                    affiliateUrl: 'https://www.amazon.com/dp/B0DPMV48KP/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.6,
                    reviews: 1800,
                    tags: ['video-lock', 'camera', 'night-vision']
                },
                {
                    name: 'Keyless Entry Smart Lock',
                    description: 'Touchscreen keypad lock with WiFi connectivity',
                    price: '$179.99',
                    category: 'smart-locks',
                    asin: 'B07Y5V15SY',
                    affiliateUrl: 'https://www.amazon.com/dp/B07Y5V15SY/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 4200,
                    tags: ['keypad-lock', 'touchscreen', 'wifi']
                },
                {
                    name: 'Smart Lock with Voice Control',
                    description: 'Alexa-compatible smart lock with voice commands',
                    price: '$229.99',
                    category: 'smart-locks',
                    asin: 'B0BXWMBNL7',
                    affiliateUrl: 'https://www.amazon.com/dp/B0BXWMBNL7/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 2100,
                    tags: ['voice-control', 'alexa', 'smart-lock']
                },
                {
                    name: 'Bluetooth Smart Lock',
                    description: 'Bluetooth-enabled smart lock with mobile app',
                    price: '$129.99',
                    category: 'smart-locks',
                    asin: 'B0F6MRBWDT',
                    affiliateUrl: 'https://www.amazon.com/dp/B0F6MRBWDT/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.2,
                    reviews: 3500,
                    tags: ['bluetooth-lock', 'mobile-app', 'keyless']
                },
                {
                    name: 'Smart Lock with Auto-Lock',
                    description: 'Automatic locking smart deadbolt with timer',
                    price: '$159.99',
                    category: 'smart-locks',
                    asin: 'B09P54CLDQ',
                    affiliateUrl: 'https://www.amazon.com/dp/B09P54CLDQ/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 2800,
                    tags: ['auto-lock', 'timer', 'smart-deadbolt']
                },
                {
                    name: 'Z-Wave Smart Lock',
                    description: 'Z-Wave compatible smart lock for home automation',
                    price: '$189.99',
                    category: 'smart-locks',
                    asin: 'B07HXMLCBT',
                    affiliateUrl: 'https://www.amazon.com/dp/B07HXMLCBT/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 1900,
                    tags: ['z-wave', 'home-automation', 'smart-lock']
                },
                {
                    name: 'Smart Lock with Guest Access',
                    description: 'Multi-user smart lock with temporary access codes',
                    price: '$219.99',
                    category: 'smart-locks',
                    asin: 'B0D8XZBR5R',
                    affiliateUrl: 'https://www.amazon.com/dp/B0D8XZBR5R/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.6,
                    reviews: 1600,
                    tags: ['guest-access', 'temporary-codes', 'multi-user']
                },
                {
                    name: 'Smart Lock with Alarm',
                    description: 'Security smart lock with tamper alarm and alerts',
                    price: '$249.99',
                    category: 'smart-locks',
                    asin: 'B0C61DKKL8',
                    affiliateUrl: 'https://www.amazon.com/dp/B0C61DKKL8/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 2200,
                    tags: ['security-alarm', 'tamper-detection', 'smart-lock']
                },
                {
                    name: 'Smart Lock with Battery Backup',
                    description: 'Long-lasting battery smart lock with backup power',
                    price: '$199.99',
                    category: 'smart-locks',
                    asin: 'B0BPSKBLXK',
                    affiliateUrl: 'https://www.amazon.com/dp/B0BPSKBLXK/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 1800,
                    tags: ['battery-backup', 'long-lasting', 'smart-lock']
                },
                {
                    name: 'Smart Lock with Weather Resistance',
                    description: 'Weatherproof smart lock for outdoor use',
                    price: '$179.99',
                    category: 'smart-locks',
                    asin: 'B0CPP15X54',
                    affiliateUrl: 'https://www.amazon.com/dp/B0CPP15X54/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 1400,
                    tags: ['weatherproof', 'outdoor', 'smart-lock']
                },
                {
                    name: 'Smart Lock with Key Override',
                    description: 'Smart lock with physical key backup option',
                    price: '$169.99',
                    category: 'smart-locks',
                    asin: 'B0C7C69FPS',
                    affiliateUrl: 'https://www.amazon.com/dp/B0C7C69FPS/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 2600,
                    tags: ['key-override', 'backup-key', 'smart-lock']
                },
                {
                    name: 'Smart Lock with Activity Log',
                    description: 'Smart lock with detailed access history tracking',
                    price: '$189.99',
                    category: 'smart-locks',
                    asin: 'B09P56Z4JC',
                    affiliateUrl: 'https://www.amazon.com/dp/B09P56Z4JC/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 2000,
                    tags: ['activity-log', 'access-history', 'smart-lock']
                },
                {
                    name: 'Smart Lock with Remote Access',
                    description: 'WiFi smart lock with remote unlock capability',
                    price: '$209.99',
                    category: 'smart-locks',
                    asin: 'B07J4VHVN5',
                    affiliateUrl: 'https://www.amazon.com/dp/B07J4VHVN5/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 3200,
                    tags: ['remote-access', 'wifi', 'smart-lock']
                },
                {
                    name: 'Smart Lock with Geofencing',
                    description: 'Location-based smart lock with automatic unlock',
                    price: '$229.99',
                    category: 'smart-locks',
                    asin: 'B0DCHCQ61J',
                    affiliateUrl: 'https://www.amazon.com/dp/B0DCHCQ61J/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 1500,
                    tags: ['geofencing', 'auto-unlock', 'location-based']
                },
                {
                    name: 'Smart Lock with Siri Control',
                    description: 'HomeKit compatible smart lock with Siri integration',
                    price: '$249.99',
                    category: 'smart-locks',
                    asin: 'B0B9HWYMV5',
                    affiliateUrl: 'https://www.amazon.com/dp/B0B9HWYMV5/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 1200,
                    tags: ['homekit', 'siri', 'apple-integration']
                },
                {
                    name: 'Smart Lock with Google Assistant',
                    description: 'Google Assistant compatible smart lock',
                    price: '$199.99',
                    category: 'smart-locks',
                    asin: 'B09P53JX4R',
                    affiliateUrl: 'https://www.amazon.com/dp/B09P53JX4R/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 1800,
                    tags: ['google-assistant', 'voice-control', 'smart-lock']
                }
            ],

            // HOME SECURITY
            'home-security': [
                {
                    name: 'Ring Security Camera',
                    description: 'Wireless security camera with night vision',
                    price: '$199.99',
                    category: 'home-security',
                    asin: 'B08H8XQZ5P',
                    affiliateUrl: this.generateProductUrl('B08H8XQZ5P'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 34000,
                    tags: ['security-camera', 'wireless', 'night-vision']
                },
                {
                    name: 'Smart Door Lock',
                    description: 'Keyless entry smart door lock',
                    price: '$149.99',
                    category: 'home-security',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 12000,
                    tags: ['smart-lock', 'keyless', 'app-control']
                },
                {
                    name: 'Motion Sensor Lights',
                    description: 'Outdoor motion-activated security lights',
                    price: '$34.99',
                    category: 'home-security',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 18000,
                    tags: ['motion-sensor', 'security-lights', 'outdoor']
                },
                {
                    name: 'Door Reinforcement Kit',
                    description: 'Heavy-duty door lock reinforcement',
                    price: '$24.99',
                    category: 'home-security',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.7,
                    reviews: 8000,
                    tags: ['door-reinforcement', 'security', 'lock-protection']
                },
                {
                    name: 'Security System',
                    description: 'Complete home security system with sensors',
                    price: '$299.99',
                    category: 'home-security',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.2,
                    reviews: 15000,
                    tags: ['security-system', 'sensors', 'alarm']
                }
            ],

            // SMART LIGHTING
            'smart-lighting': [
                {
                    name: 'Smart LED Strip Lights',
                    description: 'WiFi color-changing LED strip lights with app control',
                    price: '$29.99',
                    category: 'smart-lighting',
                    asin: 'B0C9CSVSNY',
                    affiliateUrl: 'https://www.amazon.com/dp/B0C9CSVSNY/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 3200,
                    tags: ['led-strip', 'color-changing', 'wifi-control']
                },
                {
                    name: 'Smart Bulb 4-Pack',
                    description: 'WiFi smart bulbs with dimming and color control',
                    price: '$49.99',
                    category: 'smart-lighting',
                    asin: 'B09B7NQT2K',
                    affiliateUrl: 'https://www.amazon.com/dp/B09B7NQT2K/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 2800,
                    tags: ['smart-bulbs', 'dimmable', 'color-control']
                },
                {
                    name: 'Smart Ceiling Light',
                    description: 'WiFi ceiling light with voice control and dimming',
                    price: '$79.99',
                    category: 'smart-lighting',
                    asin: 'B099WTN2TR',
                    affiliateUrl: 'https://www.amazon.com/dp/B099WTN2TR/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 1800,
                    tags: ['ceiling-light', 'voice-control', 'dimmable']
                },
                {
                    name: 'Smart Table Lamp',
                    description: 'Touch and app controlled smart table lamp',
                    price: '$59.99',
                    category: 'smart-lighting',
                    asin: 'B09V366BDY',
                    affiliateUrl: 'https://www.amazon.com/dp/B09V366BDY/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.2,
                    reviews: 2200,
                    tags: ['table-lamp', 'touch-control', 'smart-lighting']
                },
                {
                    name: 'Smart Outdoor Lights',
                    description: 'Weatherproof smart outdoor lights with motion sensor',
                    price: '$89.99',
                    category: 'smart-lighting',
                    asin: 'B0CQ3XPZTQ',
                    affiliateUrl: 'https://www.amazon.com/dp/B0CQ3XPZTQ/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 1500,
                    tags: ['outdoor-lights', 'weatherproof', 'motion-sensor']
                },
                {
                    name: 'Smart Night Light',
                    description: 'Motion-activated smart night light with color options',
                    price: '$19.99',
                    category: 'smart-lighting',
                    asin: 'B09QFYD6ST',
                    affiliateUrl: 'https://www.amazon.com/dp/B09QFYD6ST/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 3200,
                    tags: ['night-light', 'motion-activated', 'color-options']
                },
                {
                    name: 'Smart Pendant Light',
                    description: 'Modern smart pendant light with adjustable brightness',
                    price: '$129.99',
                    category: 'smart-lighting',
                    asin: 'B0D41XL87F',
                    affiliateUrl: 'https://www.amazon.com/dp/B0D41XL87F/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 1200,
                    tags: ['pendant-light', 'modern', 'adjustable-brightness']
                },
                {
                    name: 'Smart Chandelier',
                    description: 'WiFi controlled chandelier with dimming and color',
                    price: '$299.99',
                    category: 'smart-lighting',
                    asin: 'B0CG5VDC8P',
                    affiliateUrl: 'https://www.amazon.com/dp/B0CG5VDC8P/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.6,
                    reviews: 800,
                    tags: ['chandelier', 'wifi-control', 'color-changing']
                },
                {
                    name: 'Smart Floor Lamp',
                    description: 'Adjustable smart floor lamp with reading light',
                    price: '$149.99',
                    category: 'smart-lighting',
                    asin: 'B07JMX65V9',
                    affiliateUrl: 'https://www.amazon.com/dp/B07JMX65V9/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 1800,
                    tags: ['floor-lamp', 'adjustable', 'reading-light']
                },
                {
                    name: 'Smart Wall Sconce',
                    description: 'WiFi wall sconce with warm and cool light modes',
                    price: '$69.99',
                    category: 'smart-lighting',
                    asin: 'B0BM57TFZ2',
                    affiliateUrl: 'https://www.amazon.com/dp/B0BM57TFZ2/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 1400,
                    tags: ['wall-sconce', 'warm-cool-modes', 'smart-lighting']
                },
                {
                    name: 'Smart Track Lighting',
                    description: 'Adjustable smart track lighting system',
                    price: '$199.99',
                    category: 'smart-lighting',
                    asin: 'B0BJDYJ36Y',
                    affiliateUrl: 'https://www.amazon.com/dp/B0BJDYJ36Y/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 900,
                    tags: ['track-lighting', 'adjustable', 'smart-system']
                },
                {
                    name: 'Smart Recessed Lights',
                    description: 'WiFi recessed downlights with dimming control',
                    price: '$39.99',
                    category: 'smart-lighting',
                    asin: 'B0BK2PBHXZ',
                    affiliateUrl: 'https://www.amazon.com/dp/B0BK2PBHXZ/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 2100,
                    tags: ['recessed-lights', 'downlights', 'dimmable']
                },
                {
                    name: 'Smart String Lights',
                    description: 'Outdoor smart string lights with app control',
                    price: '$49.99',
                    category: 'smart-lighting',
                    asin: 'B0CRV5F1VB',
                    affiliateUrl: 'https://www.amazon.com/dp/B0CRV5F1VB/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 1800,
                    tags: ['string-lights', 'outdoor', 'app-control']
                },
                {
                    name: 'Smart Flood Light',
                    description: 'Motion-activated smart flood light with camera',
                    price: '$159.99',
                    category: 'smart-lighting',
                    asin: 'B0DRFPCJ49',
                    affiliateUrl: 'https://www.amazon.com/dp/B0DRFPCJ49/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 1200,
                    tags: ['flood-light', 'motion-activated', 'camera']
                },
                {
                    name: 'Smart Desk Lamp',
                    description: 'USB charging smart desk lamp with touch control',
                    price: '$79.99',
                    category: 'smart-lighting',
                    asin: 'B0991Q94KP',
                    affiliateUrl: 'https://www.amazon.com/dp/B0991Q94KP/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 2500,
                    tags: ['desk-lamp', 'usb-charging', 'touch-control']
                },
                {
                    name: 'Smart Under Cabinet Lights',
                    description: 'WiFi under cabinet LED lights with dimming',
                    price: '$59.99',
                    category: 'smart-lighting',
                    asin: 'B099S9DXT7',
                    affiliateUrl: 'https://www.amazon.com/dp/B099S9DXT7/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 1900,
                    tags: ['under-cabinet', 'led-lights', 'dimmable']
                },
                {
                    name: 'Smart Pathway Lights',
                    description: 'Solar smart pathway lights with motion sensor',
                    price: '$89.99',
                    category: 'smart-lighting',
                    asin: 'B0FP6ZSCZP',
                    affiliateUrl: 'https://www.amazon.com/dp/B0FP6ZSCZP/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.2,
                    reviews: 1600,
                    tags: ['pathway-lights', 'solar', 'motion-sensor']
                },
                {
                    name: 'Smart Spot Light',
                    description: 'Adjustable smart spot light for accent lighting',
                    price: '$69.99',
                    category: 'smart-lighting',
                    asin: 'B09H5VSKTZ',
                    affiliateUrl: 'https://www.amazon.com/dp/B09H5VSKTZ/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 1100,
                    tags: ['spot-light', 'adjustable', 'accent-lighting']
                },
                {
                    name: 'Smart Light Switch',
                    description: 'WiFi smart light switch with dimmer control',
                    price: '$34.99',
                    category: 'smart-lighting',
                    asin: 'B0CSJRZS97',
                    affiliateUrl: 'https://www.amazon.com/dp/B0CSJRZS97/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 2800,
                    tags: ['light-switch', 'dimmer', 'wifi-control']
                },
                {
                    name: 'Smart Light Strip Kit',
                    description: 'Complete smart light strip kit with controller',
                    price: '$39.99',
                    category: 'smart-lighting',
                    asin: 'B0BHS2JFZC',
                    affiliateUrl: 'https://www.amazon.com/dp/B0BHS2JFZC/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 2200,
                    tags: ['light-strip-kit', 'controller', 'complete-set']
                }
            ],

            // ENERGY EFFICIENCY
            'energy-efficiency': [
                {
                    name: 'LED Light Bulbs 16-Pack',
                    description: 'Energy-efficient LED bulbs',
                    price: '$29.99',
                    category: 'energy-efficiency',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 45000,
                    tags: ['led-bulbs', 'energy-saving', 'long-lasting']
                },
                {
                    name: 'Smart Power Strip',
                    description: 'WiFi-controlled power strip with surge protection',
                    price: '$39.99',
                    category: 'energy-efficiency',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 12000,
                    tags: ['smart-power-strip', 'wifi-control', 'surge-protection']
                },
                {
                    name: 'Programmable Thermostat',
                    description: '7-day programmable thermostat',
                    price: '$79.99',
                    category: 'energy-efficiency',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 18000,
                    tags: ['programmable-thermostat', 'energy-saving', 'hvac']
                },
                {
                    name: 'Insulation Foam Sealant',
                    description: 'Weatherproofing foam for gaps',
                    price: '$8.99',
                    category: 'energy-efficiency',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 15000,
                    tags: ['insulation-foam', 'weatherproofing', 'energy-saving']
                },
                {
                    name: 'Window Insulation Kit',
                    description: 'Plastic window insulation film',
                    price: '$12.99',
                    category: 'energy-efficiency',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.2,
                    reviews: 8000,
                    tags: ['window-insulation', 'draft-stopping', 'energy-saving']
                }
            ],

            // SMART WATER FIXTURES
            'smart-water-fixtures': [
                {
                    name: 'Smart Shower Head',
                    description: 'WiFi smart shower head with temperature control',
                    price: '$89.99',
                    category: 'smart-water-fixtures',
                    asin: 'B0DKSQ5YQ9',
                    affiliateUrl: 'https://www.amazon.com/dp/B0DKSQ5YQ9/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 1800,
                    tags: ['smart-shower', 'temperature-control', 'wifi']
                },
                {
                    name: 'Smart Faucet',
                    description: 'Touchless smart kitchen faucet with voice control',
                    price: '$299.99',
                    category: 'smart-water-fixtures',
                    asin: 'B076S1W5QY',
                    affiliateUrl: 'https://www.amazon.com/dp/B076S1W5QY/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 1200,
                    tags: ['smart-faucet', 'touchless', 'voice-control']
                },
                {
                    name: 'Smart Bathroom Faucet',
                    description: 'Motion-activated smart bathroom faucet',
                    price: '$199.99',
                    category: 'smart-water-fixtures',
                    asin: 'B076S69WRR',
                    affiliateUrl: 'https://www.amazon.com/dp/B076S69WRR/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 1500,
                    tags: ['bathroom-faucet', 'motion-activated', 'smart']
                },
                {
                    name: 'Smart Water Heater',
                    description: 'WiFi controlled smart water heater with app',
                    price: '$599.99',
                    category: 'smart-water-fixtures',
                    asin: 'B0D3F3HD1M',
                    affiliateUrl: 'https://www.amazon.com/dp/B0D3F3HD1M/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.6,
                    reviews: 800,
                    tags: ['water-heater', 'wifi-control', 'energy-efficient']
                },
                {
                    name: 'Smart Water Filter',
                    description: 'WiFi water filter with filter replacement alerts',
                    price: '$149.99',
                    category: 'smart-water-fixtures',
                    asin: 'B08RQDLS47',
                    affiliateUrl: 'https://www.amazon.com/dp/B08RQDLS47/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 2200,
                    tags: ['water-filter', 'filter-alerts', 'wifi']
                },
                {
                    name: 'Smart Water Softener',
                    description: 'WiFi water softener with salt level monitoring',
                    price: '$799.99',
                    category: 'smart-water-fixtures',
                    asin: 'B08559ZTDK',
                    affiliateUrl: 'https://www.amazon.com/dp/B08559ZTDK/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 600,
                    tags: ['water-softener', 'salt-monitoring', 'wifi']
                },
                {
                    name: 'Smart Water Meter',
                    description: 'WiFi water usage monitor with leak detection',
                    price: '$79.99',
                    category: 'smart-water-fixtures',
                    asin: 'B0F5Q887L8',
                    affiliateUrl: 'https://www.amazon.com/dp/B0F5Q887L8/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 1800,
                    tags: ['water-meter', 'usage-monitor', 'leak-detection']
                },
                {
                    name: 'Smart Irrigation Controller',
                    description: 'WiFi smart sprinkler controller with weather data',
                    price: '$129.99',
                    category: 'smart-water-fixtures',
                    asin: 'B0DQLFC3Q6',
                    affiliateUrl: 'https://www.amazon.com/dp/B0DQLFC3Q6/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 1400,
                    tags: ['irrigation-controller', 'sprinkler', 'weather-data']
                },
                {
                    name: 'Smart Pool Controller',
                    description: 'WiFi pool automation system with app control',
                    price: '$399.99',
                    category: 'smart-water-fixtures',
                    asin: 'B0855BFQCZ',
                    affiliateUrl: 'https://www.amazon.com/dp/B0855BFQCZ/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 900,
                    tags: ['pool-controller', 'automation', 'wifi']
                },
                {
                    name: 'Smart Water Dispenser',
                    description: 'WiFi water dispenser with temperature control',
                    price: '$199.99',
                    category: 'smart-water-fixtures',
                    asin: 'B0DKSZX9CB',
                    affiliateUrl: 'https://www.amazon.com/dp/B0DKSZX9CB/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 1200,
                    tags: ['water-dispenser', 'temperature-control', 'wifi']
                },
                {
                    name: 'Smart Water Purifier',
                    description: 'UV water purifier with WiFi monitoring',
                    price: '$249.99',
                    category: 'smart-water-fixtures',
                    asin: 'B0987FCQQW',
                    affiliateUrl: 'https://www.amazon.com/dp/B0987FCQQW/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 1600,
                    tags: ['water-purifier', 'uv-purification', 'wifi-monitoring']
                },
                {
                    name: 'Smart Water Bottle',
                    description: 'WiFi connected smart water bottle with tracking',
                    price: '$49.99',
                    category: 'smart-water-fixtures',
                    asin: 'B01CC7O8LU',
                    affiliateUrl: 'https://www.amazon.com/dp/B01CC7O8LU/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.2,
                    reviews: 2800,
                    tags: ['smart-bottle', 'hydration-tracking', 'wifi']
                },
                {
                    name: 'Smart Water Fountain',
                    description: 'WiFi pet water fountain with filter monitoring',
                    price: '$79.99',
                    category: 'smart-water-fixtures',
                    asin: 'B0FDB137K9',
                    affiliateUrl: 'https://www.amazon.com/dp/B0FDB137K9/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 1900,
                    tags: ['pet-fountain', 'filter-monitoring', 'wifi']
                },
                {
                    name: 'Smart Water Tank',
                    description: 'WiFi water storage tank with level monitoring',
                    price: '$299.99',
                    category: 'smart-water-fixtures',
                    asin: 'B0DZ295PWK',
                    affiliateUrl: 'https://www.amazon.com/dp/B0DZ295PWK/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 800,
                    tags: ['water-tank', 'level-monitoring', 'wifi']
                },
                {
                    name: 'Smart Water Pump',
                    description: 'WiFi controlled water pump with pressure monitoring',
                    price: '$199.99',
                    category: 'smart-water-fixtures',
                    asin: 'B07P1XFYJP',
                    affiliateUrl: 'https://www.amazon.com/dp/B07P1XFYJP/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 1100,
                    tags: ['water-pump', 'pressure-monitoring', 'wifi']
                },
                {
                    name: 'Smart Water Valve',
                    description: 'WiFi smart water shutoff valve with leak protection',
                    price: '$149.99',
                    category: 'smart-water-fixtures',
                    asin: 'B0BT4FYHFJ',
                    affiliateUrl: 'https://www.amazon.com/dp/B0BT4FYHFJ/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 1300,
                    tags: ['water-valve', 'leak-protection', 'wifi']
                },
                {
                    name: 'Smart Water Treatment',
                    description: 'WiFi water treatment system with quality monitoring',
                    price: '$499.99',
                    category: 'smart-water-fixtures',
                    asin: 'B0DSKG73XB',
                    affiliateUrl: 'https://www.amazon.com/dp/B0DSKG73XB/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.6,
                    reviews: 700,
                    tags: ['water-treatment', 'quality-monitoring', 'wifi']
                },
                {
                    name: 'Smart Water Heater Timer',
                    description: 'WiFi water heater timer with energy savings',
                    price: '$59.99',
                    category: 'smart-water-fixtures',
                    asin: 'B095STF6FG',
                    affiliateUrl: 'https://www.amazon.com/dp/B095STF6FG/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 1500,
                    tags: ['water-heater-timer', 'energy-savings', 'wifi']
                }
            ],

            // CLEANING & ORGANIZATION
            'cleaning-organization': [
                {
                    name: 'Robot Vacuum Cleaner',
                    description: 'WiFi-enabled robot vacuum with app control',
                    price: '$199.99',
                    category: 'cleaning-organization',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 25000,
                    tags: ['robot-vacuum', 'wifi', 'app-control']
                },
                {
                    name: 'Storage Bins Set',
                    description: 'Clear plastic storage bins with lids',
                    price: '$39.99',
                    category: 'cleaning-organization',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 18000,
                    tags: ['storage-bins', 'organization', 'clear-plastic']
                },
                {
                    name: 'Microfiber Cleaning Cloths',
                    description: 'Professional microfiber cleaning cloths 24-pack',
                    price: '$19.99',
                    category: 'cleaning-organization',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.6,
                    reviews: 12000,
                    tags: ['microfiber', 'cleaning-cloths', 'streak-free']
                },
                {
                    name: 'Cord Organizer',
                    description: 'Cable management organizer box',
                    price: '$24.99',
                    category: 'cleaning-organization',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 8000,
                    tags: ['cord-organizer', 'cable-management', 'desk-organization']
                },
                {
                    name: 'Laundry Hamper',
                    description: 'Collapsible laundry hamper with handles',
                    price: '$29.99',
                    category: 'cleaning-organization',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 6000,
                    tags: ['laundry-hamper', 'collapsible', 'bedroom-organization']
                }
            ],

            // HVAC & CLIMATE CONTROL
            'hvac-climate': [
                {
                    name: 'Smart Thermostat',
                    description: 'WiFi smart thermostat with energy savings',
                    price: '$199.99',
                    category: 'hvac-climate',
                    asin: 'B088BX9S8Z',
                    affiliateUrl: 'https://www.amazon.com/dp/B088BX9S8Z/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 3200,
                    tags: ['smart-thermostat', 'energy-savings', 'wifi']
                },
                {
                    name: 'Smart Air Conditioner',
                    description: 'WiFi portable air conditioner with app control',
                    price: '$399.99',
                    category: 'hvac-climate',
                    asin: 'B0C3GG6PL6',
                    affiliateUrl: 'https://www.amazon.com/dp/B0C3GG6PL6/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 1800,
                    tags: ['air-conditioner', 'portable', 'wifi-control']
                },
                {
                    name: 'Smart Heater',
                    description: 'WiFi space heater with temperature control',
                    price: '$149.99',
                    category: 'hvac-climate',
                    asin: 'B0DXY718RL',
                    affiliateUrl: 'https://www.amazon.com/dp/B0DXY718RL/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 2200,
                    tags: ['space-heater', 'temperature-control', 'wifi']
                },
                {
                    name: 'Smart Ceiling Fan',
                    description: 'WiFi ceiling fan with light and remote control',
                    price: '$229.99',
                    category: 'hvac-climate',
                    asin: 'B0CJXCK2SL',
                    affiliateUrl: 'https://www.amazon.com/dp/B0CJXCK2SL/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 1600,
                    tags: ['ceiling-fan', 'wifi', 'remote-control']
                },
                {
                    name: 'Smart Air Purifier',
                    description: 'HEPA air purifier with WiFi and app control',
                    price: '$299.99',
                    category: 'hvac-climate',
                    asin: 'B004Q69HIU',
                    affiliateUrl: 'https://www.amazon.com/dp/B004Q69HIU/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.6,
                    reviews: 2800,
                    tags: ['air-purifier', 'hepa-filter', 'wifi']
                },
                {
                    name: 'Smart Humidifier',
                    description: 'WiFi humidifier with humidity monitoring',
                    price: '$129.99',
                    category: 'hvac-climate',
                    asin: 'B07FNW9WYB',
                    affiliateUrl: 'https://www.amazon.com/dp/B07FNW9WYB/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 1900,
                    tags: ['humidifier', 'humidity-monitoring', 'wifi']
                },
                {
                    name: 'Smart Dehumidifier',
                    description: 'WiFi dehumidifier with smart drainage',
                    price: '$249.99',
                    category: 'hvac-climate',
                    asin: 'B07FNXS7G9',
                    affiliateUrl: 'https://www.amazon.com/dp/B07FNXS7G9/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 1400,
                    tags: ['dehumidifier', 'smart-drainage', 'wifi']
                },
                {
                    name: 'Smart Vent Fan',
                    description: 'WiFi bathroom vent fan with humidity sensor',
                    price: '$179.99',
                    category: 'hvac-climate',
                    asin: 'B07FSNDLDZ',
                    affiliateUrl: 'https://www.amazon.com/dp/B07FSNDLDZ/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 1200,
                    tags: ['vent-fan', 'humidity-sensor', 'wifi']
                },
                {
                    name: 'Smart Window AC',
                    description: 'WiFi window air conditioner with voice control',
                    price: '$349.99',
                    category: 'hvac-climate',
                    asin: 'B07CZW8HMK',
                    affiliateUrl: 'https://www.amazon.com/dp/B07CZW8HMK/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 1800,
                    tags: ['window-ac', 'voice-control', 'wifi']
                },
                {
                    name: 'Smart Heat Pump',
                    description: 'WiFi heat pump with energy monitoring',
                    price: '$1299.99',
                    category: 'hvac-climate',
                    asin: 'B07J5PKWPM',
                    affiliateUrl: 'https://www.amazon.com/dp/B07J5PKWPM/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 600,
                    tags: ['heat-pump', 'energy-monitoring', 'wifi']
                },
                {
                    name: 'Smart Radiator',
                    description: 'WiFi smart radiator with temperature control',
                    price: '$199.99',
                    category: 'hvac-climate',
                    asin: 'B07FP5X5G2',
                    affiliateUrl: 'https://www.amazon.com/dp/B07FP5X5G2/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 1000,
                    tags: ['smart-radiator', 'temperature-control', 'wifi']
                },
                {
                    name: 'Smart Baseboard Heater',
                    description: 'WiFi baseboard heater with programmable schedule',
                    price: '$159.99',
                    category: 'hvac-climate',
                    asin: 'B005GZ89WU',
                    affiliateUrl: 'https://www.amazon.com/dp/B005GZ89WU/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.2,
                    reviews: 800,
                    tags: ['baseboard-heater', 'programmable', 'wifi']
                },
                {
                    name: 'Smart Ductless Mini Split',
                    description: 'WiFi ductless mini split with zone control',
                    price: '$899.99',
                    category: 'hvac-climate',
                    asin: 'B0B286BFZQ',
                    affiliateUrl: 'https://www.amazon.com/dp/B0B286BFZQ/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 400,
                    tags: ['mini-split', 'zone-control', 'wifi']
                },
                {
                    name: 'Smart Boiler Controller',
                    description: 'WiFi boiler controller with energy monitoring',
                    price: '$299.99',
                    category: 'hvac-climate',
                    asin: 'B07TYS8H1W',
                    affiliateUrl: 'https://www.amazon.com/dp/B07TYS8H1W/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 500,
                    tags: ['boiler-controller', 'energy-monitoring', 'wifi']
                },
                {
                    name: 'Smart Heat Recovery Ventilator',
                    description: 'WiFi HRV with air quality monitoring',
                    price: '$599.99',
                    category: 'hvac-climate',
                    asin: 'B0DLT656R8',
                    affiliateUrl: 'https://www.amazon.com/dp/B0DLT656R8/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.6,
                    reviews: 300,
                    tags: ['hrv', 'air-quality', 'wifi']
                },
                {
                    name: 'Smart Zone Controller',
                    description: 'WiFi HVAC zone controller for multiple rooms',
                    price: '$199.99',
                    category: 'hvac-climate',
                    asin: 'B0FT9MRNXM',
                    affiliateUrl: 'https://www.amazon.com/dp/B0FT9MRNXM/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 400,
                    tags: ['zone-controller', 'hvac', 'wifi']
                },
                {
                    name: 'Smart Duct Damper',
                    description: 'WiFi motorized duct damper for zone control',
                    price: '$89.99',
                    category: 'hvac-climate',
                    asin: 'B01CSWPVME',
                    affiliateUrl: 'https://www.amazon.com/dp/B01CSWPVME/?tag=nestmateusa-20',
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.2,
                    reviews: 600,
                    tags: ['duct-damper', 'zone-control', 'wifi']
                }
            ],

            // BATHROOM & PERSONAL CARE
            'bathroom-personal': [
                {
                    name: 'Bathroom Scale',
                    description: 'Digital bathroom scale with BMI',
                    price: '$24.99',
                    category: 'bathroom-personal',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 15000,
                    tags: ['bathroom-scale', 'digital', 'bmi']
                },
                {
                    name: 'Shower Curtain Set',
                    description: 'Waterproof shower curtain with hooks',
                    price: '$19.99',
                    category: 'bathroom-personal',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 8000,
                    tags: ['shower-curtain', 'waterproof', 'bathroom']
                },
                {
                    name: 'Bath Towel Set',
                    description: 'Egyptian cotton bath towels 6-piece set',
                    price: '$49.99',
                    category: 'bathroom-personal',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 12000,
                    tags: ['bath-towels', 'egyptian-cotton', 'luxury']
                },
                {
                    name: 'Toothbrush Holder',
                    description: 'Wall-mounted toothbrush holder',
                    price: '$12.99',
                    category: 'bathroom-personal',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.2,
                    reviews: 5000,
                    tags: ['toothbrush-holder', 'wall-mounted', 'bathroom-organization']
                },
                {
                    name: 'Bath Mat Set',
                    description: 'Memory foam bath mat with non-slip bottom',
                    price: '$29.99',
                    category: 'bathroom-personal',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 9000,
                    tags: ['bath-mat', 'memory-foam', 'non-slip']
                }
            ],

            // BEDROOM & LIVING ROOM
            'bedroom-living': [
                {
                    name: 'Memory Foam Pillow',
                    description: 'Cooling gel memory foam pillow',
                    price: '$39.99',
                    category: 'bedroom-living',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.3,
                    reviews: 18000,
                    tags: ['memory-foam-pillow', 'cooling-gel', 'sleep']
                },
                {
                    name: 'Throw Blanket',
                    description: 'Soft fleece throw blanket 50x60 inches',
                    price: '$24.99',
                    category: 'bedroom-living',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.5,
                    reviews: 12000,
                    tags: ['throw-blanket', 'fleece', 'cozy']
                },
                {
                    name: 'LED Floor Lamp',
                    description: 'Modern LED floor lamp with dimmer',
                    price: '$79.99',
                    category: 'bedroom-living',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.4,
                    reviews: 8000,
                    tags: ['floor-lamp', 'led', 'dimmer']
                },
                {
                    name: 'Decorative Pillows',
                    description: 'Set of 2 decorative throw pillows',
                    price: '$34.99',
                    category: 'bedroom-living',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.2,
                    reviews: 6000,
                    tags: ['decorative-pillows', 'throw-pillows', 'home-decor']
                },
                {
                    name: 'Candles Set',
                    description: 'Soy wax candles with wooden wicks',
                    price: '$29.99',
                    category: 'bedroom-living',
                    asin: 'B07G9BF4KQ',
                    affiliateUrl: this.generateProductUrl('B07G9BF4KQ'),
                    image: 'https://m.media-amazon.com/images/I/71Q4V2R6TBL._AC_SL1500_.jpg',
                    rating: 4.6,
                    reviews: 10000,
                    tags: ['candles', 'soy-wax', 'wooden-wicks']
                }
            ]
        };
    }

    /**
     * Get all products from a specific category
     */
    getProductsByCategory(category) {
        const catalog = this.getProductCatalog();
        return catalog[category] || [];
    }

    /**
     * Get all products from all categories
     */
    getAllProducts() {
        const catalog = this.getProductCatalog();
        const allProducts = [];
        
        Object.values(catalog).forEach(categoryProducts => {
            allProducts.push(...categoryProducts);
        });
        
        return allProducts;
    }

    /**
     * Search products by keyword
     */
    searchProducts(keyword) {
        const allProducts = this.getAllProducts();
        const searchTerm = keyword.toLowerCase();
        
        return allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    /**
     * Get random products for recommendations
     */
    getRandomProducts(count = 12) {
        const allProducts = this.getAllProducts();
        const shuffled = allProducts.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    /**
     * Get products by price range
     */
    getProductsByPriceRange(minPrice, maxPrice) {
        const allProducts = this.getAllProducts();
        
        return allProducts.filter(product => {
            const price = parseFloat(product.price.replace('$', ''));
            return price >= minPrice && price <= maxPrice;
        });
    }

    /**
     * Get trending products (highest rated)
     */
    getTrendingProducts(count = 10) {
        const allProducts = this.getAllProducts();
        
        return allProducts
            .sort((a, b) => b.rating - a.rating)
            .slice(0, count);
    }

    /**
     * Get best value products (high rating, low price)
     */
    getBestValueProducts(count = 10) {
        const allProducts = this.getAllProducts();
        
        return allProducts
            .map(product => ({
                ...product,
                valueScore: product.rating / parseFloat(product.price.replace('$', ''))
            }))
            .sort((a, b) => b.valueScore - a.valueScore)
            .slice(0, count);
    }
}

// Initialize the catalog
const amazonCatalog = new AmazonProductCatalog();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AmazonProductCatalog;
}
