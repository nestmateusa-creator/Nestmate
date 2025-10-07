/**
 * NestMate Autoblog Integration Script
 * 
 * This script integrates all autoblog components and provides
 * a unified interface for managing the entire autoblog system.
 */

class AutoblogIntegration {
    constructor() {
        this.manager = null;
        this.publisher = null;
        this.seoOptimizer = null;
        this.socialMedia = null;
        this.isInitialized = false;
        
        this.initializeComponents();
    }

    async initializeComponents() {
        try {
            // Initialize all components
            this.manager = new AutoblogManager();
            this.publisher = new AutoblogPublisher();
            this.seoOptimizer = new AutoblogSEOOptimizer();
            this.socialMedia = new AutoblogSocialMedia();
            
            this.isInitialized = true;
            console.log('✅ Autoblog system initialized successfully');
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Start background processes
            this.startBackgroundProcesses();
            
        } catch (error) {
            console.error('❌ Failed to initialize autoblog system:', error);
        }
    }

    setupEventListeners() {
        // Listen for content generation events
        document.addEventListener('autoblog:contentGenerated', (event) => {
            this.handleContentGenerated(event.detail);
        });

        // Listen for publishing events
        document.addEventListener('autoblog:postPublished', (event) => {
            this.handlePostPublished(event.detail);
        });

        // Listen for scheduling events
        document.addEventListener('autoblog:postScheduled', (event) => {
            this.handlePostScheduled(event.detail);
        });
    }

    startBackgroundProcesses() {
        // Check for scheduled posts every minute
        setInterval(() => {
            this.checkScheduledPosts();
        }, 60000);

        // Generate trending content daily
        setInterval(() => {
            this.generateTrendingContent();
        }, 24 * 60 * 60 * 1000);

        // Update analytics hourly
        setInterval(() => {
            this.updateAnalytics();
        }, 60 * 60 * 1000);
    }

    async generateCompleteContent(topic, audience, keywords, options = {}) {
        if (!this.isInitialized) {
            throw new Error('Autoblog system not initialized');
        }

        try {
            // Step 1: Generate base content
            const baseContent = await this.manager.generateContent({
                topic,
                audience,
                keywords,
                wordCount: options.wordCount || 800,
                tone: options.tone || 'professional'
            });

            // Step 2: Optimize for SEO
            const seoOptimizedContent = this.seoOptimizer.optimizeContentForSEO(
                baseContent,
                topic,
                keywords
            );

            // Step 3: Generate social media posts
            const socialMediaPosts = this.socialMedia.generateSocialMediaPosts(
                seoOptimizedContent,
                topic
            );

            // Step 4: Create comprehensive content package
            const completeContent = {
                ...seoOptimizedContent,
                socialMedia: socialMediaPosts,
                analytics: this.generateAnalyticsData(seoOptimizedContent),
                metadata: {
                    generatedAt: new Date().toISOString(),
                    version: '1.0',
                    system: 'NestMate Autoblog'
                }
            };

            // Dispatch event
            this.dispatchEvent('autoblog:contentGenerated', completeContent);

            return completeContent;

        } catch (error) {
            console.error('Error generating complete content:', error);
            throw error;
        }
    }

    async publishCompletePost(content, scheduleOptions = {}) {
        if (!this.isInitialized) {
            throw new Error('Autoblog system not initialized');
        }

        try {
            const results = {
                blogPost: null,
                socialMedia: [],
                seo: null,
                analytics: null
            };

            // Step 1: Publish blog post
            if (scheduleOptions.scheduleDate) {
                results.blogPost = await this.publisher.schedulePost(content, scheduleOptions.scheduleDate);
            } else {
                results.blogPost = await this.publisher.publishPost(content);
            }

            // Step 2: Schedule social media posts
            if (content.socialMedia && scheduleOptions.autoSocialMedia !== false) {
                const socialSchedule = this.socialMedia.scheduleSocialMediaPosts(
                    content.socialMedia,
                    scheduleOptions.socialMediaSchedule
                );
                results.socialMedia = socialSchedule;
            }

            // Step 3: Generate SEO report
            results.seo = this.seoOptimizer.generateSEOReport(content);

            // Step 4: Set up analytics tracking
            results.analytics = this.setupAnalyticsTracking(content);

            // Dispatch event
            this.dispatchEvent('autoblog:postPublished', results);

            return results;

        } catch (error) {
            console.error('Error publishing complete post:', error);
            throw error;
        }
    }

    async checkScheduledPosts() {
        if (!this.isInitialized) return;

        try {
            const scheduledPosts = JSON.parse(
                localStorage.getItem('nestmate-autoblog-scheduled') || '[]'
            );

            const now = new Date();
            const postsToPublish = scheduledPosts.filter(post => {
                const scheduledDate = new Date(post.scheduledDate);
                return scheduledDate <= now && post.status === 'scheduled';
            });

            for (const post of postsToPublish) {
                await this.publishCompletePost(post);
                
                // Update post status
                post.status = 'published';
                post.publishedAt = new Date().toISOString();
            }

            if (postsToPublish.length > 0) {
                localStorage.setItem('nestmate-autoblog-scheduled', JSON.stringify(scheduledPosts));
                console.log(`📝 Published ${postsToPublish.length} scheduled posts`);
            }

        } catch (error) {
            console.error('Error checking scheduled posts:', error);
        }
    }

    async generateTrendingContent() {
        if (!this.isInitialized) return;

        try {
            const trendingTopics = [
                'smart-home-automation',
                'energy-efficiency-tips',
                'home-security-systems',
                'sustainable-living',
                'home-office-setup'
            ];

            const randomTopic = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
            const audiences = ['homeowners', 'new-homeowners', 'home-buyers'];
            const randomAudience = audiences[Math.floor(Math.random() * audiences.length)];

            const content = await this.generateCompleteContent(
                randomTopic,
                randomAudience,
                [randomTopic.replace('-', ' ')],
                {
                    wordCount: 600,
                    tone: 'friendly'
                }
            );

            // Schedule for tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(9, 0, 0, 0);

            await this.publishCompletePost(content, {
                scheduleDate: tomorrow.toISOString(),
                autoSocialMedia: true
            });

            console.log(`🤖 Generated trending content: ${content.title}`);

        } catch (error) {
            console.error('Error generating trending content:', error);
        }
    }

    updateAnalytics() {
        if (!this.isInitialized) return;

        try {
            const publishedPosts = JSON.parse(
                localStorage.getItem('nestmate-autoblog-published') || '[]'
            );

            const analytics = {
                totalPosts: publishedPosts.length,
                postsThisWeek: this.getPostsThisWeek(publishedPosts),
                postsThisMonth: this.getPostsThisMonth(publishedPosts),
                averageSEOScore: this.getAverageSEOScore(publishedPosts),
                topCategories: this.getTopCategories(publishedPosts),
                engagementMetrics: this.getEngagementMetrics(publishedPosts)
            };

            localStorage.setItem('nestmate-autoblog-analytics', JSON.stringify(analytics));
            console.log('📊 Analytics updated');

        } catch (error) {
            console.error('Error updating analytics:', error);
        }
    }

    generateAnalyticsData(content) {
        return {
            seoScore: content.seoScore || 0,
            wordCount: content.wordCount || content.content.split(' ').length,
            readabilityScore: content.seo?.readabilityScore || 0,
            keywordDensity: content.seo?.keywordDensity || 0,
            estimatedReadTime: Math.ceil((content.wordCount || content.content.split(' ').length) / 200),
            engagementPotential: this.calculateEngagementPotential(content),
            socialMediaReach: this.estimateSocialMediaReach(content)
        };
    }

    setupAnalyticsTracking(content) {
        return {
            trackingId: `post_${Date.now()}`,
            startTime: new Date().toISOString(),
            metrics: {
                views: 0,
                shares: 0,
                comments: 0,
                timeOnPage: 0,
                bounceRate: 0
            },
            goals: {
                targetViews: 100,
                targetShares: 10,
                targetComments: 5,
                targetTimeOnPage: 120
            }
        };
    }

    calculateEngagementPotential(content) {
        let score = 0;
        
        // Content length
        const wordCount = content.wordCount || content.content.split(' ').length;
        if (wordCount >= 500 && wordCount <= 1500) score += 20;
        
        // SEO score
        if (content.seoScore >= 70) score += 20;
        
        // Social media presence
        if (content.socialMedia) score += 15;
        
        // Readability
        if (content.seo?.readabilityScore >= 60) score += 15;
        
        // Keywords
        if (content.seo?.keywordDensity >= 0.01 && content.seo?.keywordDensity <= 0.03) score += 15;
        
        // Structure
        if (content.seo?.headingStructure?.hasProperStructure) score += 15;
        
        return Math.min(100, score);
    }

    estimateSocialMediaReach(content) {
        const baseReach = {
            facebook: 1000,
            twitter: 500,
            linkedin: 800,
            instagram: 600,
            pinterest: 400
        };

        // Adjust based on content quality
        const qualityMultiplier = (content.seoScore || 50) / 100;
        
        Object.keys(baseReach).forEach(platform => {
            baseReach[platform] = Math.floor(baseReach[platform] * (0.5 + qualityMultiplier));
        });

        return baseReach;
    }

    getPostsThisWeek(posts) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        return posts.filter(post => 
            new Date(post.publishedAt || post.createdAt) >= oneWeekAgo
        ).length;
    }

    getPostsThisMonth(posts) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        return posts.filter(post => 
            new Date(post.publishedAt || post.createdAt) >= oneMonthAgo
        ).length;
    }

    getAverageSEOScore(posts) {
        const postsWithScore = posts.filter(post => post.seoScore);
        if (postsWithScore.length === 0) return 0;
        
        const totalScore = postsWithScore.reduce((sum, post) => sum + post.seoScore, 0);
        return Math.round(totalScore / postsWithScore.length);
    }

    getTopCategories(posts) {
        const categories = {};
        posts.forEach(post => {
            const category = post.category || 'Uncategorized';
            categories[category] = (categories[category] || 0) + 1;
        });

        return Object.entries(categories)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([category, count]) => ({ category, count }));
    }

    getEngagementMetrics(posts) {
        const totalPosts = posts.length;
        if (totalPosts === 0) return { average: 0, trend: 'stable' };

        const totalEngagement = posts.reduce((sum, post) => {
            return sum + (post.analytics?.engagementPotential || 0);
        }, 0);

        const average = Math.round(totalEngagement / totalPosts);
        
        // Calculate trend (simplified)
        const recentPosts = posts.slice(0, Math.min(5, totalPosts));
        const recentAverage = recentPosts.reduce((sum, post) => {
            return sum + (post.analytics?.engagementPotential || 0);
        }, 0) / recentPosts.length;

        let trend = 'stable';
        if (recentAverage > average * 1.1) trend = 'increasing';
        else if (recentAverage < average * 0.9) trend = 'decreasing';

        return { average, trend };
    }

    handleContentGenerated(content) {
        console.log('📝 Content generated:', content.title);
        
        // Update UI if on manager page
        if (typeof autoblogManager !== 'undefined') {
            autoblogManager.currentContent = content;
            autoblogManager.displayContentPreview(content);
            autoblogManager.enableActionButtons();
        }
    }

    handlePostPublished(results) {
        console.log('🚀 Post published:', results.blogPost?.filename);
        
        // Update analytics
        this.updateAnalytics();
        
        // Show notification
        this.showNotification('Post published successfully!');
    }

    handlePostScheduled(post) {
        console.log('📅 Post scheduled:', post.title);
        
        // Show notification
        this.showNotification(`Post scheduled for ${new Date(post.scheduledDate).toLocaleString()}`);
    }

    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#22c55e' : '#ef4444'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            font-weight: 600;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Public API methods
    async generateAndPublish(topic, audience, keywords, options = {}) {
        const content = await this.generateCompleteContent(topic, audience, keywords, options);
        return await this.publishCompletePost(content, options);
    }

    async generateAndSchedule(topic, audience, keywords, scheduleDate, options = {}) {
        const content = await this.generateCompleteContent(topic, audience, keywords, options);
        return await this.publishCompletePost(content, { ...options, scheduleDate });
    }

    getAnalytics() {
        const analytics = localStorage.getItem('nestmate-autoblog-analytics');
        return analytics ? JSON.parse(analytics) : null;
    }

    getScheduledPosts() {
        const scheduled = localStorage.getItem('nestmate-autoblog-scheduled');
        return scheduled ? JSON.parse(scheduled) : [];
    }

    getPublishedPosts() {
        const published = localStorage.getItem('nestmate-autoblog-published');
        return published ? JSON.parse(published) : [];
    }

    // Configuration methods
    configureAutoSchedule(enabled, frequency = 'weekly') {
        localStorage.setItem('nestmate-autoblog-auto-schedule', JSON.stringify({
            enabled,
            frequency,
            configuredAt: new Date().toISOString()
        }));
    }

    configureSocialMedia(enabled, platforms = ['facebook', 'twitter', 'linkedin']) {
        localStorage.setItem('nestmate-autoblog-social-media', JSON.stringify({
            enabled,
            platforms,
            configuredAt: new Date().toISOString()
        }));
    }

    configureSEO(settings = {}) {
        const defaultSettings = {
            keywordDensity: 0.02,
            maxTitleLength: 60,
            maxDescriptionLength: 160,
            enableStructuredData: true,
            enableInternalLinking: true
        };

        localStorage.setItem('nestmate-autoblog-seo-settings', JSON.stringify({
            ...defaultSettings,
            ...settings,
            configuredAt: new Date().toISOString()
        }));
    }
}

// Initialize the integration system when the page loads
let autoblogIntegration;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        autoblogIntegration = new AutoblogIntegration();
        window.autoblogIntegration = autoblogIntegration;
        
        // Wait for initialization
        await new Promise(resolve => {
            const checkInit = () => {
                if (autoblogIntegration.isInitialized) {
                    resolve();
                } else {
                    setTimeout(checkInit, 100);
                }
            };
            checkInit();
        });
        
        console.log('🎉 NestMate Autoblog System Ready!');
        
    } catch (error) {
        console.error('Failed to initialize autoblog integration:', error);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoblogIntegration;
} else {
    window.AutoblogIntegration = AutoblogIntegration;
}
