class AutoblogSocialMedia {
    constructor() {
        this.platforms = {
            facebook: {
                name: 'Facebook',
                maxLength: 2200,
                hashtagLimit: 5,
                imageRequired: false,
                linkRequired: true
            },
            twitter: {
                name: 'Twitter',
                maxLength: 280,
                hashtagLimit: 3,
                imageRequired: false,
                linkRequired: true
            },
            linkedin: {
                name: 'LinkedIn',
                maxLength: 1300,
                hashtagLimit: 5,
                imageRequired: false,
                linkRequired: true
            },
            instagram: {
                name: 'Instagram',
                maxLength: 2200,
                hashtagLimit: 30,
                imageRequired: true,
                linkRequired: false
            },
            pinterest: {
                name: 'Pinterest',
                maxLength: 500,
                hashtagLimit: 20,
                imageRequired: true,
                linkRequired: true
            }
        };

        this.hashtagDatabase = this.initializeHashtagDatabase();
        this.postingTemplates = this.initializePostingTemplates();
    }

    initializeHashtagDatabase() {
        return {
            'home-management': ['#HomeManagement', '#PropertyCare', '#HomeownerTips', '#HouseMaintenance', '#HomeCare'],
            'home-improvement': ['#HomeImprovement', '#DIY', '#Renovation', '#HomeUpgrade', '#HomeProjects'],
            'energy-efficiency': ['#EnergyEfficiency', '#GreenHome', '#SustainableLiving', '#EnergySavings', '#EcoFriendly'],
            'home-security': ['#HomeSecurity', '#HomeSafety', '#SecuritySystems', '#HomeProtection', '#SafetyFirst'],
            'maintenance': ['#HomeMaintenance', '#PreventiveCare', '#HomeCare', '#MaintenanceTips', '#PropertyUpkeep'],
            'smart-home': ['#SmartHome', '#HomeAutomation', '#IoT', '#ConnectedHome', '#TechHome'],
            'real-estate': ['#RealEstate', '#PropertyValue', '#HomeBuying', '#RealEstateMarket', '#PropertyInvestment'],
            'construction': ['#Construction', '#Building', '#Contractor', '#ConstructionProject', '#BuildingTips'],
            'diy-projects': ['#DIY', '#DoItYourself', '#HomeProjects', '#DIYHome', '#Handyman'],
            'home-finance': ['#HomeFinance', '#Mortgage', '#HomeLoans', '#PropertyInvestment', '#RealEstateFinance']
        };
    }

    initializePostingTemplates() {
        return {
            'home-management': {
                facebook: "🏠 New blog post: {title}\n\n{excerpt}\n\nLearn more about home management and get expert tips from NestMate! 💡\n\n{hashtags}",
                twitter: "🏠 {title}\n\n{excerpt}\n\n{hashtags}",
                linkedin: "📝 Just published: {title}\n\n{excerpt}\n\nAs homeowners, we all want to maintain our properties effectively. This comprehensive guide provides valuable insights and actionable tips.\n\n{hashtags}",
                instagram: "🏠 {title}\n\n{excerpt}\n\nSwipe up to read the full article and discover expert home management tips! 💡\n\n{hashtags}",
                pinterest: "{title} - {excerpt} {hashtags}"
            },
            'home-improvement': {
                facebook: "🔨 Home improvement alert! {title}\n\n{excerpt}\n\nTransform your home with these expert tips and DIY projects! 🏡\n\n{hashtags}",
                twitter: "🔨 {title}\n\n{excerpt}\n\n{hashtags}",
                linkedin: "🏗️ Home improvement insights: {title}\n\n{excerpt}\n\nWhether you're planning a major renovation or small DIY projects, this guide offers valuable strategies for success.\n\n{hashtags}",
                instagram: "🔨 {title}\n\n{excerpt}\n\nGet inspired for your next home project! 💪\n\n{hashtags}",
                pinterest: "{title} - {excerpt} {hashtags}"
            },
            'energy-efficiency': {
                facebook: "🌱 Going green at home! {title}\n\n{excerpt}\n\nSave money and help the environment with these energy efficiency tips! 💚\n\n{hashtags}",
                twitter: "🌱 {title}\n\n{excerpt}\n\n{hashtags}",
                linkedin: "🌿 Energy efficiency focus: {title}\n\n{excerpt}\n\nSustainable living starts at home. Discover practical ways to reduce energy consumption and lower utility bills.\n\n{hashtags}",
                instagram: "🌱 {title}\n\n{excerpt}\n\nMake your home more eco-friendly! 🌍\n\n{hashtags}",
                pinterest: "{title} - {excerpt} {hashtags}"
            }
        };
    }

    generateSocialMediaPosts(content, topic) {
        const posts = {};
        const template = this.postingTemplates[topic] || this.postingTemplates['home-management'];
        const hashtags = this.generateHashtags(topic, content.tags);

        Object.keys(this.platforms).forEach(platform => {
            posts[platform] = this.createPlatformPost(content, platform, template, hashtags);
        });

        return posts;
    }

    createPlatformPost(content, platform, template, hashtags) {
        const platformConfig = this.platforms[platform];
        const platformTemplate = template[platform] || template.facebook;
        
        let post = platformTemplate
            .replace('{title}', content.title)
            .replace('{excerpt}', this.truncateExcerpt(content.excerpt, platform))
            .replace('{hashtags}', this.formatHashtags(hashtags, platform));

        // Ensure post fits platform requirements
        post = this.optimizeForPlatform(post, platform);

        return {
            content: post,
            platform: platformConfig.name,
            characterCount: post.length,
            maxLength: platformConfig.maxLength,
            withinLimit: post.length <= platformConfig.maxLength,
            hashtagCount: (post.match(/#\w+/g) || []).length,
            needsImage: platformConfig.imageRequired,
            needsLink: platformConfig.linkRequired,
            suggestedImage: this.suggestImage(content, platform),
            suggestedLink: this.suggestLink(content)
        };
    }

    generateHashtags(topic, contentTags = []) {
        const topicHashtags = this.hashtagDatabase[topic] || this.hashtagDatabase['home-management'];
        const generalHashtags = ['#NestMate', '#HomeTips', '#PropertyManagement'];
        
        // Combine topic-specific and general hashtags
        const allHashtags = [...topicHashtags, ...generalHashtags];
        
        // Add content-specific hashtags
        if (contentTags && contentTags.length > 0) {
            const contentHashtags = contentTags
                .filter(tag => tag.length > 2)
                .map(tag => `#${tag.replace(/\s+/g, '')}`)
                .slice(0, 3);
            allHashtags.push(...contentHashtags);
        }

        return allHashtags;
    }

    formatHashtags(hashtags, platform) {
        const platformConfig = this.platforms[platform];
        const limitedHashtags = hashtags.slice(0, platformConfig.hashtagLimit);
        return limitedHashtags.join(' ');
    }

    truncateExcerpt(excerpt, platform) {
        const platformConfig = this.platforms[platform];
        const maxExcerptLength = platformConfig.maxLength - 200; // Reserve space for other content
        
        if (excerpt.length <= maxExcerptLength) {
            return excerpt;
        }
        
        return excerpt.substring(0, maxExcerptLength - 3) + '...';
    }

    optimizeForPlatform(post, platform) {
        const platformConfig = this.platforms[platform];
        
        // Ensure post fits character limit
        if (post.length > platformConfig.maxLength) {
            post = this.truncatePost(post, platform);
        }

        // Platform-specific optimizations
        switch (platform) {
            case 'twitter':
                post = this.optimizeForTwitter(post);
                break;
            case 'instagram':
                post = this.optimizeForInstagram(post);
                break;
            case 'linkedin':
                post = this.optimizeForLinkedIn(post);
                break;
            case 'pinterest':
                post = this.optimizeForPinterest(post);
                break;
        }

        return post;
    }

    optimizeForTwitter(post) {
        // Twitter-specific optimizations
        // Remove extra spaces and optimize for engagement
        post = post.replace(/\s+/g, ' ').trim();
        
        // Add engagement elements if space allows
        if (post.length < 250) {
            post += '\n\n💡 What do you think?';
        }
        
        return post;
    }

    optimizeForInstagram(post) {
        // Instagram-specific optimizations
        // Add line breaks for better readability
        post = post.replace(/\. /g, '.\n\n');
        
        // Add emojis for visual appeal
        if (!post.includes('🏠') && !post.includes('💡')) {
            post = '🏠 ' + post;
        }
        
        return post;
    }

    optimizeForLinkedIn(post) {
        // LinkedIn-specific optimizations
        // More professional tone
        post = post.replace(/!+/g, '.');
        
        // Add professional call-to-action
        if (post.length < 1000) {
            post += '\n\nWhat are your thoughts on this topic? Share your experience in the comments below.';
        }
        
        return post;
    }

    optimizeForPinterest(post) {
        // Pinterest-specific optimizations
        // Focus on actionable content
        post = post.replace(/Learn more about/g, 'Discover');
        post = post.replace(/Get expert tips/g, 'Get tips');
        
        return post;
    }

    truncatePost(post, platform) {
        const platformConfig = this.platforms[platform];
        const maxLength = platformConfig.maxLength - 50; // Buffer for truncation
        
        // Try to truncate at sentence boundary
        const sentences = post.split('. ');
        let truncatedPost = '';
        
        for (const sentence of sentences) {
            if ((truncatedPost + sentence + '. ').length <= maxLength) {
                truncatedPost += sentence + '. ';
            } else {
                break;
            }
        }
        
        // If no complete sentences fit, truncate at word boundary
        if (truncatedPost.length === 0) {
            const words = post.split(' ');
            truncatedPost = words.slice(0, Math.floor(maxLength / 6)).join(' ') + '...';
        }
        
        return truncatedPost.trim();
    }

    suggestImage(content, platform) {
        const imageSuggestions = {
            'home-management': {
                facebook: 'home-management-dashboard.jpg',
                twitter: 'home-tips-square.jpg',
                linkedin: 'professional-home-management.jpg',
                instagram: 'home-management-lifestyle.jpg',
                pinterest: 'home-management-infographic.jpg'
            },
            'home-improvement': {
                facebook: 'diy-projects.jpg',
                twitter: 'home-improvement-tools.jpg',
                linkedin: 'construction-professional.jpg',
                instagram: 'before-after-renovation.jpg',
                pinterest: 'home-improvement-ideas.jpg'
            },
            'energy-efficiency': {
                facebook: 'green-home.jpg',
                twitter: 'energy-savings.jpg',
                linkedin: 'sustainable-building.jpg',
                instagram: 'eco-friendly-home.jpg',
                pinterest: 'energy-efficiency-tips.jpg'
            }
        };

        const topicImages = imageSuggestions[content.category?.toLowerCase().replace(/\s+/g, '-')] || imageSuggestions['home-management'];
        return topicImages[platform] || 'default-blog-image.jpg';
    }

    suggestLink(content) {
        // Generate appropriate link based on content
        const baseUrl = 'https://nestmateusa.com';
        
        if (content.filename) {
            return `${baseUrl}/${content.filename}`;
        }
        
        // Fallback to main blog page
        return `${baseUrl}/blog.html`;
    }

    scheduleSocialMediaPosts(posts, scheduleOptions = {}) {
        const scheduledPosts = [];
        const defaultSchedule = {
            facebook: { hour: 9, minute: 0 },
            twitter: { hour: 12, minute: 0 },
            linkedin: { hour: 8, minute: 30 },
            instagram: { hour: 18, minute: 0 },
            pinterest: { hour: 15, minute: 0 }
        };

        const schedule = { ...defaultSchedule, ...scheduleOptions };

        Object.keys(posts).forEach(platform => {
            const post = posts[platform];
            const platformSchedule = schedule[platform];
            
            if (platformSchedule) {
                const scheduledTime = new Date();
                scheduledTime.setHours(platformSchedule.hour, platformSchedule.minute, 0, 0);
                
                // If time has passed today, schedule for tomorrow
                if (scheduledTime <= new Date()) {
                    scheduledTime.setDate(scheduledTime.getDate() + 1);
                }

                scheduledPosts.push({
                    platform: platform,
                    content: post.content,
                    scheduledTime: scheduledTime.toISOString(),
                    status: 'scheduled',
                    image: post.suggestedImage,
                    link: post.suggestedLink
                });
            }
        });

        return scheduledPosts;
    }

    generateEngagementMetrics(posts) {
        const metrics = {};
        
        Object.keys(posts).forEach(platform => {
            const post = posts[platform];
            const platformMetrics = this.calculateEngagementScore(post, platform);
            
            metrics[platform] = {
                ...platformMetrics,
                platform: platform,
                content: post.content,
                characterCount: post.characterCount,
                withinLimit: post.withinLimit
            };
        });

        return metrics;
    }

    calculateEngagementScore(post, platform) {
        let score = 0;
        
        // Character count optimization
        const platformConfig = this.platforms[platform];
        const optimalLength = platformConfig.maxLength * 0.8;
        
        if (post.characterCount >= optimalLength * 0.7 && post.characterCount <= optimalLength * 1.1) {
            score += 25;
        }

        // Hashtag optimization
        const hashtagCount = (post.content.match(/#\w+/g) || []).length;
        if (hashtagCount >= 2 && hashtagCount <= platformConfig.hashtagLimit) {
            score += 20;
        }

        // Engagement elements
        if (post.content.includes('?')) score += 15; // Questions
        if (post.content.includes('!')) score += 10; // Exclamations
        if (post.content.includes('💡') || post.content.includes('🏠')) score += 15; // Emojis
        if (post.content.includes('Learn') || post.content.includes('Discover')) score += 10; // Action words

        // Platform-specific optimizations
        switch (platform) {
            case 'twitter':
                if (post.content.length <= 280) score += 20;
                break;
            case 'instagram':
                if (post.content.includes('\n\n')) score += 15; // Line breaks
                break;
            case 'linkedin':
                if (post.content.includes('professional') || post.content.includes('industry')) score += 15;
                break;
        }

        return {
            engagementScore: Math.min(100, score),
            hashtagCount: hashtagCount,
            hasQuestions: post.content.includes('?'),
            hasEmojis: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(post.content),
            optimalLength: post.characterCount >= optimalLength * 0.7 && post.characterCount <= optimalLength * 1.1
        };
    }

    generateCrossPlatformStrategy(content, topic) {
        const strategy = {
            primaryPlatform: this.determinePrimaryPlatform(topic),
            postingSequence: this.determinePostingSequence(topic),
            contentVariations: this.createContentVariations(content, topic),
            optimalTiming: this.getOptimalTiming(topic),
            engagementTactics: this.getEngagementTactics(topic)
        };

        return strategy;
    }

    determinePrimaryPlatform(topic) {
        const platformPreferences = {
            'home-management': 'linkedin',
            'home-improvement': 'pinterest',
            'energy-efficiency': 'facebook',
            'home-security': 'facebook',
            'maintenance': 'twitter',
            'smart-home': 'instagram',
            'real-estate': 'linkedin',
            'construction': 'linkedin',
            'diy-projects': 'pinterest',
            'home-finance': 'linkedin'
        };

        return platformPreferences[topic] || 'facebook';
    }

    determinePostingSequence(topic) {
        const sequences = {
            'home-management': ['linkedin', 'facebook', 'twitter', 'pinterest'],
            'home-improvement': ['pinterest', 'instagram', 'facebook', 'twitter'],
            'energy-efficiency': ['facebook', 'linkedin', 'twitter', 'instagram'],
            'smart-home': ['instagram', 'twitter', 'facebook', 'linkedin']
        };

        return sequences[topic] || ['facebook', 'twitter', 'linkedin', 'pinterest'];
    }

    createContentVariations(content, topic) {
        const variations = {
            question: this.createQuestionVariation(content),
            tip: this.createTipVariation(content),
            statistic: this.createStatisticVariation(content),
            personal: this.createPersonalVariation(content)
        };

        return variations;
    }

    createQuestionVariation(content) {
        return `What's your biggest challenge with ${content.category.toLowerCase()}? Our latest blog post might have the answer! 🏠\n\n${content.excerpt}\n\nRead more: ${this.suggestLink(content)}`;
    }

    createTipVariation(content) {
        return `💡 Pro tip: ${content.excerpt}\n\nGet more expert advice in our latest blog post about ${content.category.toLowerCase()}!\n\n${this.suggestLink(content)}`;
    }

    createStatisticVariation(content) {
        return `📊 Did you know? ${content.excerpt}\n\nLearn more surprising facts and expert tips in our latest blog post!\n\n${this.suggestLink(content)}`;
    }

    createPersonalVariation(content) {
        return `As homeowners, we all face challenges with ${content.category.toLowerCase()}. Our latest blog post shares practical solutions that actually work! 🏠\n\n${content.excerpt}\n\n${this.suggestLink(content)}`;
    }

    getOptimalTiming(topic) {
        const timing = {
            'home-management': {
                facebook: '9:00 AM',
                twitter: '12:00 PM',
                linkedin: '8:30 AM',
                instagram: '6:00 PM',
                pinterest: '3:00 PM'
            },
            'home-improvement': {
                facebook: '10:00 AM',
                twitter: '1:00 PM',
                linkedin: '9:00 AM',
                instagram: '7:00 PM',
                pinterest: '2:00 PM'
            }
        };

        return timing[topic] || timing['home-management'];
    }

    getEngagementTactics(topic) {
        return {
            callToAction: this.getCallToAction(topic),
            questions: this.getEngagementQuestions(topic),
            hashtags: this.generateHashtags(topic),
            emojis: this.getRelevantEmojis(topic)
        };
    }

    getCallToAction(topic) {
        const ctas = {
            'home-management': 'Share your home management tips in the comments!',
            'home-improvement': 'What\'s your next home improvement project?',
            'energy-efficiency': 'How do you save energy at home?',
            'smart-home': 'What smart home devices do you use?'
        };

        return ctas[topic] || 'What do you think? Share your thoughts below!';
    }

    getEngagementQuestions(topic) {
        const questions = {
            'home-management': [
                'What\'s your biggest home management challenge?',
                'How do you stay organized at home?',
                'What home maintenance task do you dread most?'
            ],
            'home-improvement': [
                'What\'s your favorite DIY project?',
                'What home improvement would you tackle first?',
                'What\'s the most challenging renovation you\'ve done?'
            ]
        };

        return questions[topic] || ['What do you think?', 'Have you tried this?', 'What\'s your experience?'];
    }

    getRelevantEmojis(topic) {
        const emojis = {
            'home-management': ['🏠', '💡', '📋', '🔧', '⭐'],
            'home-improvement': ['🔨', '🏗️', '💪', '✨', '🎯'],
            'energy-efficiency': ['🌱', '💚', '⚡', '🌍', '💰'],
            'smart-home': ['🤖', '📱', '🏠', '⚡', '🔮']
        };

        return emojis[topic] || ['🏠', '💡', '⭐', '👍', '📝'];
    }

    // Method to integrate with actual social media APIs
    async postToSocialMedia(platform, post, accessToken) {
        // This would integrate with actual social media APIs
        // For now, return a mock response
        
        const mockResponse = {
            success: true,
            platform: platform,
            postId: `post_${Date.now()}`,
            url: `https://${platform}.com/posts/post_${Date.now()}`,
            timestamp: new Date().toISOString()
        };

        return mockResponse;
    }

    // Method to track social media performance
    async trackSocialMediaPerformance(postId, platform) {
        // This would integrate with social media analytics APIs
        // For now, return mock analytics data
        
        const mockAnalytics = {
            postId: postId,
            platform: platform,
            impressions: Math.floor(Math.random() * 1000) + 100,
            engagement: Math.floor(Math.random() * 100) + 10,
            clicks: Math.floor(Math.random() * 50) + 5,
            shares: Math.floor(Math.random() * 20) + 1,
            comments: Math.floor(Math.random() * 15) + 1,
            timestamp: new Date().toISOString()
        };

        return mockAnalytics;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoblogSocialMedia;
} else {
    window.AutoblogSocialMedia = AutoblogSocialMedia;
}
