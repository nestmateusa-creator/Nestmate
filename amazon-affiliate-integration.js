/**
 * Amazon Affiliate Integration for NestMate
 * Handles product search, affiliate links, and commission tracking
 */

class AmazonAffiliateIntegration {
    constructor() {
        this.affiliateTag = 'nestmateusa-20';
        this.baseUrl = 'https://www.amazon.com';
        this.commissionData = this.loadCommissionData();
        this.productCache = new Map();
    }

    /**
     * Generate Amazon affiliate URL for product search
     * @param {string} productName - Name of the product to search
     * @param {string} category - Optional product category
     * @returns {string} - Amazon affiliate URL
     */
    generateAffiliateUrl(productName, category = '') {
        const searchQuery = encodeURIComponent(productName);
        const categoryParam = category ? `&i=${encodeURIComponent(category)}` : '';
        return `${this.baseUrl}/s?k=${searchQuery}${categoryParam}&tag=${this.affiliateTag}&ref=sr_pg_1`;
    }

    /**
     * Generate direct product affiliate URL
     * @param {string} asin - Amazon Standard Identification Number
     * @returns {string} - Direct product affiliate URL
     */
    generateProductUrl(asin) {
        return `${this.baseUrl}/dp/${asin}?tag=${this.affiliateTag}&linkCode=ur2&camp=1789&creative=9325`;
    }

    /**
     * Create "Buy Now" button with affiliate link
     * @param {string} productName - Product name
     * @param {string} currentPrice - Current price
     * @param {string} targetPrice - Target price
     * @returns {HTMLElement} - Buy Now button element
     */
    createBuyNowButton(productName, currentPrice, targetPrice) {
        const button = document.createElement('button');
        button.className = 'buy-now-btn';
        button.innerHTML = `
            <i class="fas fa-shopping-cart"></i>
            Buy Now on Amazon
        `;
        
        button.onclick = () => {
            this.trackClick(productName, currentPrice, targetPrice);
            window.open(this.generateAffiliateUrl(productName), '_blank');
        };
        
        return button;
    }

    /**
     * Create product search integration
     * @param {string} containerId - Container element ID
     */
    createProductSearch(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="amazon-search-container">
                <h3><i class="fab fa-amazon"></i> Amazon Product Search</h3>
                <div class="search-form">
                    <input type="text" id="productSearchInput" placeholder="Search for products on Amazon..." class="search-input">
                    <select id="productCategory" class="category-select">
                        <option value="">All Categories</option>
                        <option value="home-garden">Home & Garden</option>
                        <option value="electronics">Electronics</option>
                        <option value="tools">Tools & Home Improvement</option>
                        <option value="appliances">Appliances</option>
                        <option value="smart-home">Smart Home</option>
                        <option value="furniture">Furniture</option>
                    </select>
                    <button id="searchAmazonBtn" class="search-btn">
                        <i class="fas fa-search"></i> Search Amazon
                    </button>
                </div>
                <div id="searchResults" class="search-results"></div>
            </div>
        `;

        // Add event listeners
        document.getElementById('searchAmazonBtn').onclick = () => this.performProductSearch();
        document.getElementById('productSearchInput').onkeypress = (e) => {
            if (e.key === 'Enter') this.performProductSearch();
        };
    }

    /**
     * Perform product search and display results
     */
    async performProductSearch() {
        const searchInput = document.getElementById('productSearchInput');
        const categorySelect = document.getElementById('productCategory');
        const resultsContainer = document.getElementById('searchResults');
        
        const productName = searchInput.value.trim();
        const category = categorySelect.value;
        
        if (!productName) {
            alert('Please enter a product name to search');
            return;
        }

        resultsContainer.innerHTML = '<div class="loading">Searching Amazon...</div>';

        try {
            // Simulate product search (in real implementation, you'd use Amazon API)
            const mockResults = this.generateMockSearchResults(productName, category);
            this.displaySearchResults(mockResults, resultsContainer);
        } catch (error) {
            console.error('Search error:', error);
            resultsContainer.innerHTML = '<div class="error">Search failed. Please try again.</div>';
        }
    }

    /**
     * Generate mock search results (replace with real Amazon API)
     * @param {string} productName - Product name
     * @param {string} category - Product category
     * @returns {Array} - Mock search results
     */
    generateMockSearchResults(productName, category) {
        const baseResults = [
            {
                name: `${productName} - Premium Model`,
                price: '$199.99',
                originalPrice: '$249.99',
                rating: 4.5,
                reviews: 1234,
                asin: 'B08' + Math.random().toString(36).substr(2, 7).toUpperCase(),
                image: 'https://via.placeholder.com/150x150?text=Product+Image',
                category: category || 'electronics'
            },
            {
                name: `${productName} - Standard Model`,
                price: '$149.99',
                originalPrice: '$179.99',
                rating: 4.2,
                reviews: 856,
                asin: 'B09' + Math.random().toString(36).substr(2, 7).toUpperCase(),
                image: 'https://via.placeholder.com/150x150?text=Product+Image',
                category: category || 'electronics'
            },
            {
                name: `${productName} - Budget Model`,
                price: '$99.99',
                originalPrice: '$129.99',
                rating: 4.0,
                reviews: 432,
                asin: 'B10' + Math.random().toString(36).substr(2, 7).toUpperCase(),
                image: 'https://via.placeholder.com/150x150?text=Product+Image',
                category: category || 'electronics'
            }
        ];

        return baseResults;
    }

    /**
     * Display search results
     * @param {Array} results - Search results
     * @param {HTMLElement} container - Results container
     */
    displaySearchResults(results, container) {
        container.innerHTML = results.map(product => `
            <div class="product-result">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h4 class="product-name">${product.name}</h4>
                    <div class="product-price">
                        <span class="current-price">${product.price}</span>
                        <span class="original-price">${product.originalPrice}</span>
                    </div>
                    <div class="product-rating">
                        <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
                        <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                    </div>
                    <div class="product-actions">
                        <button class="buy-btn" onclick="amazonIntegration.trackClick('${product.name}', '${product.price}', '${product.originalPrice}'); window.open('${this.generateProductUrl(product.asin)}', '_blank');">
                            <i class="fas fa-shopping-cart"></i> Buy Now
                        </button>
                        <button class="track-btn" onclick="amazonIntegration.addToPriceTracking('${product.name}', '${product.price}', '${product.asin}');">
                            <i class="fas fa-bell"></i> Track Price
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Add product to price tracking
     * @param {string} productName - Product name
     * @param {string} currentPrice - Current price
     * @param {string} asin - Amazon ASIN
     */
    addToPriceTracking(productName, currentPrice, asin) {
        // Get target price from user
        const targetPrice = prompt(`Set target price for ${productName} (current: ${currentPrice}):`);
        if (!targetPrice) return;

        const priceAlert = {
            id: Date.now(),
            productName: productName,
            currentPrice: currentPrice,
            targetPrice: targetPrice,
            asin: asin,
            affiliateUrl: this.generateProductUrl(asin),
            dateAdded: new Date().toISOString(),
            status: 'active'
        };

        // Save to localStorage (in real app, save to database)
        const existingAlerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
        existingAlerts.push(priceAlert);
        localStorage.setItem('priceAlerts', JSON.stringify(existingAlerts));

        // Show success message
        this.showNotification(`Price alert added for ${productName}`, 'success');
        
        // Refresh price alerts display if on dashboard
        if (typeof loadPriceAlerts === 'function') {
            loadPriceAlerts();
        }
    }

    /**
     * Track affiliate link clicks
     * @param {string} productName - Product name
     * @param {string} currentPrice - Current price
     * @param {string} targetPrice - Target price
     */
    trackClick(productName, currentPrice, targetPrice) {
        const clickData = {
            timestamp: new Date().toISOString(),
            productName: productName,
            currentPrice: currentPrice,
            targetPrice: targetPrice,
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };

        // Save click data
        const clicks = JSON.parse(localStorage.getItem('affiliateClicks') || '[]');
        clicks.push(clickData);
        localStorage.setItem('affiliateClicks', JSON.stringify(clicks));

        // Update commission data
        this.updateCommissionData(productName, currentPrice);
        
        console.log('Affiliate click tracked:', clickData);
    }

    /**
     * Update commission tracking data
     * @param {string} productName - Product name
     * @param {string} price - Product price
     */
    updateCommissionData(productName, price) {
        const priceValue = parseFloat(price.replace('$', ''));
        const estimatedCommission = priceValue * 0.04; // 4% estimated commission rate

        this.commissionData.totalClicks++;
        this.commissionData.totalRevenue += estimatedCommission;
        this.commissionData.products[productName] = (this.commissionData.products[productName] || 0) + estimatedCommission;

        this.saveCommissionData();
    }

    /**
     * Load commission data from localStorage
     * @returns {Object} - Commission data
     */
    loadCommissionData() {
        const defaultData = {
            totalClicks: 0,
            totalRevenue: 0,
            products: {},
            lastUpdated: new Date().toISOString()
        };

        return JSON.parse(localStorage.getItem('commissionData') || JSON.stringify(defaultData));
    }

    /**
     * Save commission data to localStorage
     */
    saveCommissionData() {
        this.commissionData.lastUpdated = new Date().toISOString();
        localStorage.setItem('commissionData', JSON.stringify(this.commissionData));
    }

    /**
     * Get commission dashboard data
     * @returns {Object} - Commission dashboard data
     */
    getCommissionDashboard() {
        return {
            totalClicks: this.commissionData.totalClicks,
            totalRevenue: this.commissionData.totalRevenue,
            topProducts: Object.entries(this.commissionData.products)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10),
            lastUpdated: this.commissionData.lastUpdated
        };
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info)
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

    /**
     * Create commission tracking dashboard
     * @param {string} containerId - Container element ID
     */
    createCommissionDashboard(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const dashboard = this.getCommissionDashboard();
        
        container.innerHTML = `
            <div class="commission-dashboard">
                <h3><i class="fas fa-chart-line"></i> Amazon Affiliate Performance</h3>
                <div class="commission-stats">
                    <div class="stat-card">
                        <div class="stat-value">${dashboard.totalClicks}</div>
                        <div class="stat-label">Total Clicks</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">$${dashboard.totalRevenue.toFixed(2)}</div>
                        <div class="stat-label">Estimated Revenue</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${dashboard.totalClicks > 0 ? (dashboard.totalRevenue / dashboard.totalClicks).toFixed(2) : '0.00'}</div>
                        <div class="stat-label">Avg. Commission</div>
                    </div>
                </div>
                <div class="top-products">
                    <h4>Top Performing Products</h4>
                    <div class="product-list">
                        ${dashboard.topProducts.map(([product, revenue]) => `
                            <div class="product-item">
                                <span class="product-name">${product}</span>
                                <span class="product-revenue">$${revenue.toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="last-updated">
                    Last updated: ${new Date(dashboard.lastUpdated).toLocaleString()}
                </div>
            </div>
        `;
    }
}

// Initialize Amazon integration
const amazonIntegration = new AmazonAffiliateIntegration();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AmazonAffiliateIntegration;
}
