/**
 * NestMate Product Recommendation Engine
 * Smart product suggestions for homeowners with Amazon affiliate links
 */

class ProductRecommendationEngine {
    constructor() {
        this.affiliateTag = 'nestmateusa-20';
        this.affiliateHomepage = 'https://www.amazon.com?&linkCode=ll2&tag=nestmateusa-20&linkId=8e9dc927270a08024cdcdbbfbb031428&language=en_US&ref_=as_li_ss_tl';
        this.baseUrl = 'https://www.amazon.com';
        this.userData = this.loadUserData();
        this.productCatalog = this.initializeProductCatalog();
        this.recommendationHistory = this.loadRecommendationHistory();
        
        // Use the comprehensive Amazon catalog if available
        if (typeof amazonCatalog !== 'undefined') {
            this.amazonCatalog = amazonCatalog;
        }
    }

    /**
     * Load user data from Firebase/localStorage
     */
    loadUserData() {
        // In real implementation, this would come from Firebase
        return {
            homeType: localStorage.getItem('homeType') || 'single-family',
            homeAge: parseInt(localStorage.getItem('homeAge')) || 0,
            squareFootage: parseInt(localStorage.getItem('squareFootage')) || 0,
            bedrooms: parseInt(localStorage.getItem('bedrooms')) || 0,
            bathrooms: parseInt(localStorage.getItem('bathrooms')) || 0,
            hasPool: localStorage.getItem('hasPool') === 'true',
            hasGarden: localStorage.getItem('hasGarden') === 'true',
            hasGarage: localStorage.getItem('hasGarage') === 'true',
            recentSearches: JSON.parse(localStorage.getItem('recentSearches') || '[]'),
            viewedProducts: JSON.parse(localStorage.getItem('viewedProducts') || '[]'),
            homeMaintenance: JSON.parse(localStorage.getItem('homeMaintenance') || '[]'),
            seasonalNeeds: this.getSeasonalNeeds()
        };
    }

    /**
     * Get seasonal product recommendations
     */
    getSeasonalNeeds() {
        const month = new Date().getMonth();
        const needs = [];
        
        if (month >= 2 && month <= 4) { // Spring
            needs.push('spring-cleaning', 'garden-tools', 'outdoor-furniture', 'air-conditioning');
        } else if (month >= 5 && month <= 7) { // Summer
            needs.push('cooling', 'outdoor-living', 'pool-maintenance', 'insect-control');
        } else if (month >= 8 && month <= 10) { // Fall
            needs.push('heating', 'leaf-removal', 'winter-prep', 'insulation');
        } else { // Winter
            needs.push('heating', 'snow-removal', 'indoor-comfort', 'energy-efficiency');
        }
        
        return needs;
    }

    /**
     * Initialize comprehensive product catalog
     */
    initializeProductCatalog() {
        return {
            'smart-home': [
                {
                    name: 'Smart Thermostat',
                    description: 'Energy-efficient temperature control',
                    price: '$199.99',
                    category: 'smart-home',
                    tags: ['energy-saving', 'automation', 'heating-cooling'],
                    affiliateUrl: this.generateAffiliateUrl('Smart Thermostat', 'smart-home'),
                    image: 'https://via.placeholder.com/200x200?text=Smart+Thermostat',
                    rating: 4.5,
                    reviews: 2847
                },
                {
                    name: 'Smart Doorbell',
                    description: 'Video doorbell with motion detection',
                    price: '$149.99',
                    category: 'smart-home',
                    tags: ['security', 'video', 'motion-detection'],
                    affiliateUrl: this.generateAffiliateUrl('Smart Doorbell', 'smart-home'),
                    image: 'https://via.placeholder.com/200x200?text=Smart+Doorbell',
                    rating: 4.3,
                    reviews: 1923
                },
                {
                    name: 'Smart Light Bulbs',
                    description: 'WiFi-enabled LED bulbs with app control',
                    price: '$39.99',
                    category: 'smart-home',
                    tags: ['lighting', 'automation', 'energy-saving'],
                    affiliateUrl: this.generateAffiliateUrl('Smart Light Bulbs', 'smart-home'),
                    image: 'https://via.placeholder.com/200x200?text=Smart+Bulbs',
                    rating: 4.2,
                    reviews: 1567
                }
            ],
            'home-maintenance': [
                {
                    name: 'Air Filter Replacement Set',
                    description: 'High-efficiency HVAC air filters',
                    price: '$24.99',
                    category: 'home-maintenance',
                    tags: ['hvac', 'air-quality', 'maintenance'],
                    affiliateUrl: this.generateAffiliateUrl('HVAC Air Filters', 'home-garden'),
                    image: 'https://via.placeholder.com/200x200?text=Air+Filters',
                    rating: 4.4,
                    reviews: 892
                },
                {
                    name: 'Caulk Gun Set',
                    description: 'Professional caulking tools for home repairs',
                    price: '$18.99',
                    category: 'home-maintenance',
                    tags: ['tools', 'repairs', 'sealing'],
                    affiliateUrl: this.generateAffiliateUrl('Caulk Gun Set', 'tools'),
                    image: 'https://via.placeholder.com/200x200?text=Caulk+Gun',
                    rating: 4.6,
                    reviews: 445
                },
                {
                    name: 'Smoke Detector',
                    description: 'Battery-operated smoke and carbon monoxide detector',
                    price: '$34.99',
                    category: 'home-maintenance',
                    tags: ['safety', 'smoke-detector', 'carbon-monoxide'],
                    affiliateUrl: this.generateAffiliateUrl('Smoke Detector', 'home-garden'),
                    image: 'https://via.placeholder.com/200x200?text=Smoke+Detector',
                    rating: 4.7,
                    reviews: 1234
                }
            ],
            'energy-efficiency': [
                {
                    name: 'LED Light Bulbs Pack',
                    description: 'Energy-efficient LED bulbs for whole home',
                    price: '$29.99',
                    category: 'energy-efficiency',
                    tags: ['led', 'energy-saving', 'lighting'],
                    affiliateUrl: this.generateAffiliateUrl('LED Light Bulbs', 'home-garden'),
                    image: 'https://via.placeholder.com/200x200?text=LED+Bulbs',
                    rating: 4.5,
                    reviews: 2134
                },
                {
                    name: 'Programmable Outlet Timer',
                    description: 'Save energy with automatic outlet control',
                    price: '$12.99',
                    category: 'energy-efficiency',
                    tags: ['energy-saving', 'automation', 'outlet'],
                    affiliateUrl: this.generateAffiliateUrl('Outlet Timer', 'home-garden'),
                    image: 'https://via.placeholder.com/200x200?text=Outlet+Timer',
                    rating: 4.3,
                    reviews: 567
                },
                {
                    name: 'Insulation Foam Sealant',
                    description: 'Weatherproofing foam for gaps and cracks',
                    price: '$8.99',
                    category: 'energy-efficiency',
                    tags: ['insulation', 'weatherproofing', 'energy-saving'],
                    affiliateUrl: this.generateAffiliateUrl('Insulation Foam', 'home-garden'),
                    image: 'https://via.placeholder.com/200x200?text=Insulation+Foam',
                    rating: 4.4,
                    reviews: 789
                }
            ],
            'outdoor-living': [
                {
                    name: 'Outdoor String Lights',
                    description: 'Weather-resistant LED string lights for patio',
                    price: '$19.99',
                    category: 'outdoor-living',
                    tags: ['outdoor', 'lighting', 'patio'],
                    affiliateUrl: this.generateAffiliateUrl('Outdoor String Lights', 'home-garden'),
                    image: 'https://via.placeholder.com/200x200?text=String+Lights',
                    rating: 4.6,
                    reviews: 1456
                },
                {
                    name: 'Garden Hose Nozzle',
                    description: 'Adjustable spray nozzle for garden and cleaning',
                    price: '$14.99',
                    category: 'outdoor-living',
                    tags: ['garden', 'hose', 'watering'],
                    affiliateUrl: this.generateAffiliateUrl('Garden Hose Nozzle', 'home-garden'),
                    image: 'https://via.placeholder.com/200x200?text=Hose+Nozzle',
                    rating: 4.5,
                    reviews: 923
                },
                {
                    name: 'Outdoor Furniture Covers',
                    description: 'Weatherproof covers for patio furniture',
                    price: '$39.99',
                    category: 'outdoor-living',
                    tags: ['outdoor', 'furniture', 'protection'],
                    affiliateUrl: this.generateAffiliateUrl('Furniture Covers', 'home-garden'),
                    image: 'https://via.placeholder.com/200x200?text=Furniture+Covers',
                    rating: 4.3,
                    reviews: 678
                }
            ],
            'home-security': [
                {
                    name: 'Security Camera System',
                    description: 'Wireless security cameras with night vision',
                    price: '$199.99',
                    category: 'home-security',
                    tags: ['security', 'cameras', 'surveillance'],
                    affiliateUrl: this.generateAffiliateUrl('Security Camera System', 'electronics'),
                    image: 'https://via.placeholder.com/200x200?text=Security+Cameras',
                    rating: 4.4,
                    reviews: 1876
                },
                {
                    name: 'Door Lock Reinforcement',
                    description: 'Heavy-duty door lock reinforcement kit',
                    price: '$24.99',
                    category: 'home-security',
                    tags: ['security', 'door-locks', 'reinforcement'],
                    affiliateUrl: this.generateAffiliateUrl('Door Lock Reinforcement', 'home-garden'),
                    image: 'https://via.placeholder.com/200x200?text=Lock+Reinforcement',
                    rating: 4.7,
                    reviews: 445
                },
                {
                    name: 'Motion Sensor Lights',
                    description: 'Outdoor motion-activated security lights',
                    price: '$34.99',
                    category: 'home-security',
                    tags: ['security', 'motion-sensor', 'outdoor-lighting'],
                    affiliateUrl: this.generateAffiliateUrl('Motion Sensor Lights', 'home-garden'),
                    image: 'https://via.placeholder.com/200x200?text=Motion+Lights',
                    rating: 4.5,
                    reviews: 1123
                }
            ],
            'kitchen-appliances': [
                {
                    name: 'Air Fryer',
                    description: 'Healthy cooking with less oil',
                    price: '$89.99',
                    category: 'kitchen-appliances',
                    tags: ['cooking', 'healthy', 'appliance'],
                    affiliateUrl: this.generateAffiliateUrl('Air Fryer', 'appliances'),
                    image: 'https://via.placeholder.com/200x200?text=Air+Fryer',
                    rating: 4.6,
                    reviews: 3456
                },
                {
                    name: 'Coffee Maker',
                    description: 'Programmable coffee maker with timer',
                    price: '$79.99',
                    category: 'kitchen-appliances',
                    tags: ['coffee', 'appliance', 'programmable'],
                    affiliateUrl: this.generateAffiliateUrl('Coffee Maker', 'appliances'),
                    image: 'https://via.placeholder.com/200x200?text=Coffee+Maker',
                    rating: 4.4,
                    reviews: 2134
                },
                {
                    name: 'Food Storage Containers',
                    description: 'Airtight food storage container set',
                    price: '$29.99',
                    category: 'kitchen-appliances',
                    tags: ['storage', 'food', 'containers'],
                    affiliateUrl: this.generateAffiliateUrl('Food Storage Containers', 'home-garden'),
                    image: 'https://via.placeholder.com/200x200?text=Storage+Containers',
                    rating: 4.5,
                    reviews: 1876
                }
            ]
        };
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
     * Get personalized product recommendations
     */
    getPersonalizedRecommendations(limit = 12) {
        const recommendations = [];
        const userData = this.userData;
        
        // Use comprehensive Amazon catalog if available
        if (this.amazonCatalog) {
            // Priority 1: Seasonal needs
            userData.seasonalNeeds.forEach(need => {
                const products = this.getProductsByNeed(need);
                recommendations.push(...products.slice(0, 2));
            });
            
            // Priority 2: Home characteristics
            if (userData.homeAge > 20) {
                recommendations.push(...this.amazonCatalog.getProductsByCategory('home-maintenance').slice(0, 2));
            }
            
            if (userData.squareFootage > 2000) {
                recommendations.push(...this.amazonCatalog.getProductsByCategory('energy-efficiency').slice(0, 2));
            }
            
            if (userData.hasGarden) {
                recommendations.push(...this.amazonCatalog.getProductsByCategory('outdoor-garden').slice(0, 2));
            }
            
            // Priority 3: Recent searches
            userData.recentSearches.forEach(search => {
                const products = this.amazonCatalog.searchProducts(search);
                recommendations.push(...products.slice(0, 1));
            });
            
            // Priority 4: Trending products
            if (recommendations.length < limit) {
                const trendingProducts = this.amazonCatalog.getTrendingProducts();
                recommendations.push(...trendingProducts.slice(0, limit - recommendations.length));
            }
        } else {
            // Fallback to basic catalog
            userData.seasonalNeeds.forEach(need => {
                const products = this.getProductsByNeed(need);
                recommendations.push(...products.slice(0, 2));
            });
            
            if (userData.homeAge > 20) {
                recommendations.push(...this.getProductsByCategory('home-maintenance').slice(0, 2));
            }
            
            if (userData.squareFootage > 2000) {
                recommendations.push(...this.getProductsByCategory('energy-efficiency').slice(0, 2));
            }
            
            if (userData.hasGarden) {
                recommendations.push(...this.getProductsByCategory('outdoor-living').slice(0, 2));
            }
            
            userData.recentSearches.forEach(search => {
                const products = this.searchProducts(search);
                recommendations.push(...products.slice(0, 1));
            });
            
            if (recommendations.length < limit) {
                const defaultProducts = this.getDefaultRecommendations();
                recommendations.push(...defaultProducts.slice(0, limit - recommendations.length));
            }
        }
        
        // Remove duplicates and limit results
        const uniqueRecommendations = this.removeDuplicates(recommendations);
        return uniqueRecommendations.slice(0, limit);
    }

    /**
     * Get products by specific need
     */
    getProductsByNeed(need) {
        const needMap = {
            'spring-cleaning': ['home-maintenance', 'outdoor-living'],
            'garden-tools': ['outdoor-living'],
            'outdoor-furniture': ['outdoor-living'],
            'air-conditioning': ['energy-efficiency', 'smart-home'],
            'cooling': ['energy-efficiency', 'smart-home'],
            'outdoor-living': ['outdoor-living'],
            'pool-maintenance': ['outdoor-living', 'home-maintenance'],
            'insect-control': ['outdoor-living', 'home-maintenance'],
            'heating': ['energy-efficiency', 'smart-home'],
            'leaf-removal': ['outdoor-living'],
            'winter-prep': ['energy-efficiency', 'home-maintenance'],
            'insulation': ['energy-efficiency'],
            'snow-removal': ['outdoor-living'],
            'indoor-comfort': ['smart-home', 'energy-efficiency'],
            'energy-efficiency': ['energy-efficiency']
        };
        
        const categories = needMap[need] || ['home-maintenance'];
        const products = [];
        
        categories.forEach(category => {
            products.push(...this.getProductsByCategory(category));
        });
        
        return products;
    }

    /**
     * Get products by category
     */
    getProductsByCategory(category) {
        return this.productCatalog[category] || [];
    }

    /**
     * Search products by keyword
     */
    searchProducts(keyword) {
        const results = [];
        const searchTerm = keyword.toLowerCase();
        
        Object.values(this.productCatalog).forEach(products => {
            products.forEach(product => {
                if (product.name.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm) ||
                    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
                    results.push(product);
                }
            });
        });
        
        return results;
    }

    /**
     * Get default recommendations for new users
     */
    getDefaultRecommendations() {
        return [
            ...this.getProductsByCategory('smart-home').slice(0, 3),
            ...this.getProductsByCategory('home-maintenance').slice(0, 3),
            ...this.getProductsByCategory('energy-efficiency').slice(0, 3),
            ...this.getProductsByCategory('home-security').slice(0, 3)
        ];
    }

    /**
     * Remove duplicate products
     */
    removeDuplicates(products) {
        const seen = new Set();
        return products.filter(product => {
            if (seen.has(product.name)) {
                return false;
            }
            seen.add(product.name);
            return true;
        });
    }

    /**
     * Load recommendation history
     */
    loadRecommendationHistory() {
        return JSON.parse(localStorage.getItem('recommendationHistory') || '[]');
    }

    /**
     * Save recommendation history
     */
    saveRecommendationHistory() {
        localStorage.setItem('recommendationHistory', JSON.stringify(this.recommendationHistory));
    }

    /**
     * Track product view
     */
    trackProductView(product) {
        this.recommendationHistory.push({
            product: product.name,
            timestamp: new Date().toISOString(),
            category: product.category
        });
        
        // Keep only last 50 views
        if (this.recommendationHistory.length > 50) {
            this.recommendationHistory = this.recommendationHistory.slice(-50);
        }
        
        this.saveRecommendationHistory();
    }

    /**
     * Create product recommendation display
     */
    createRecommendationDisplay(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const recommendations = this.getPersonalizedRecommendations();
        
        container.innerHTML = `
            <div class="product-recommendations">
                <div class="recommendations-header">
                    <h3><i class="fas fa-lightbulb"></i> Recommended for Your Home</h3>
                    <p class="recommendations-subtitle">Products tailored to your home's needs and seasonal requirements</p>
                </div>
                <div class="recommendations-grid">
                    ${recommendations.map(product => this.createProductCard(product)).join('')}
                </div>
                <div class="recommendations-footer">
                    <button class="refresh-recommendations-btn" onclick="productEngine.refreshRecommendations()">
                        <i class="fas fa-sync"></i> Refresh Recommendations
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Create individual product card
     */
    createProductCard(product) {
        return `
            <div class="product-card" onclick="productEngine.trackProductView('${product.name}'); window.open('${product.affiliateUrl}', '_blank');">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-category">${product.category.replace('-', ' ').toUpperCase()}</div>
                </div>
                <div class="product-info">
                    <h4 class="product-name">${product.name}</h4>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
                        <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                    </div>
                    <div class="product-price">${product.price}</div>
                    <div class="product-tags">
                        ${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="product-action">
                    <button class="buy-now-btn">
                        <i class="fas fa-shopping-cart"></i> View on Amazon
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Refresh recommendations
     */
    refreshRecommendations() {
        this.userData = this.loadUserData(); // Reload user data
        this.createRecommendationDisplay('productRecommendations');
        this.showNotification('Recommendations refreshed!', 'success');
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize product recommendation engine
const productEngine = new ProductRecommendationEngine();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductRecommendationEngine;
}
