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
