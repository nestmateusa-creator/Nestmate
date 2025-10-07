class AutoblogSEOOptimizer {
    constructor() {
        this.keywordDensity = 0.02; // 2% keyword density
        this.maxTitleLength = 60;
        this.maxDescriptionLength = 160;
        this.initializeSEOData();
    }

    initializeSEOData() {
        this.seoKeywords = {
            'home-management': ['home management', 'property maintenance', 'homeowner tips', 'house care'],
            'home-improvement': ['home improvement', 'renovation', 'home upgrades', 'diy projects'],
            'energy-efficiency': ['energy efficiency', 'energy savings', 'green home', 'sustainable living'],
            'home-security': ['home security', 'home safety', 'security systems', 'home protection'],
            'maintenance': ['home maintenance', 'preventive maintenance', 'home care', 'maintenance tips'],
            'smart-home': ['smart home', 'home automation', 'iot devices', 'connected home'],
            'real-estate': ['real estate', 'property value', 'home buying', 'real estate market'],
            'construction': ['construction', 'building', 'contractor', 'construction project'],
            'diy-projects': ['diy', 'do it yourself', 'home projects', 'diy home improvement'],
            'home-finance': ['home finance', 'mortgage', 'home loans', 'property investment']
        };

        this.competitorKeywords = [
            'home management software',
            'property management tools',
            'home maintenance app',
            'smart home automation',
            'home improvement tips',
            'energy efficient homes',
            'home security systems',
            'real estate technology',
            'construction management',
            'diy home projects'
        ];
    }

    optimizeContentForSEO(content, topic, keywords = []) {
        const optimizedContent = {
            ...content,
            seo: this.generateSEOData(content, topic, keywords)
        };

        // Optimize title for SEO
        optimizedContent.title = this.optimizeTitle(content.title, keywords);
        
        // Optimize content for keyword density
        optimizedContent.content = this.optimizeContentKeywords(content.content, keywords);
        
        // Generate meta description
        optimizedContent.metaDescription = this.generateMetaDescription(content, keywords);
        
        // Generate structured data
        optimizedContent.structuredData = this.generateStructuredData(content, topic);
        
        // Generate internal linking suggestions
        optimizedContent.internalLinks = this.generateInternalLinks(content, topic);
        
        // Calculate SEO score
        optimizedContent.seoScore = this.calculateSEOScore(optimizedContent);

        return optimizedContent;
    }

    generateSEOData(content, topic, keywords) {
        const primaryKeyword = keywords[0] || this.getPrimaryKeyword(topic);
        const secondaryKeywords = keywords.slice(1, 5);
        
        return {
            primaryKeyword,
            secondaryKeywords,
            keywordDensity: this.calculateKeywordDensity(content.content, primaryKeyword),
            titleOptimized: this.isTitleOptimized(content.title, primaryKeyword),
            metaDescriptionOptimized: this.isMetaDescriptionOptimized(content.excerpt),
            contentLength: content.content.length,
            headingStructure: this.analyzeHeadingStructure(content.content),
            internalLinks: this.countInternalLinks(content.content),
            externalLinks: this.countExternalLinks(content.content),
            imagesOptimized: this.checkImageOptimization(content.content),
            readabilityScore: this.calculateReadabilityScore(content.content)
        };
    }

    optimizeTitle(title, keywords) {
        const primaryKeyword = keywords[0];
        if (!primaryKeyword) return title;

        // Ensure primary keyword is in title
        if (!title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
            // Add keyword to title if not present
            const words = title.split(' ');
            const keywordWords = primaryKeyword.split(' ');
            
            // Insert keyword at the beginning or end
            if (title.length < this.maxTitleLength - primaryKeyword.length - 1) {
                return `${primaryKeyword}: ${title}`;
            }
        }

        // Optimize title length
        if (title.length > this.maxTitleLength) {
            return title.substring(0, this.maxTitleLength - 3) + '...';
        }

        return title;
    }

    optimizeContentKeywords(content, keywords) {
        let optimizedContent = content;
        const primaryKeyword = keywords[0];
        
        if (primaryKeyword) {
            // Calculate current keyword density
            const currentDensity = this.calculateKeywordDensity(content, primaryKeyword);
            
            // Add keywords if density is too low
            if (currentDensity < this.keywordDensity) {
                optimizedContent = this.increaseKeywordDensity(content, primaryKeyword, this.keywordDensity);
            }
            
            // Reduce keywords if density is too high
            if (currentDensity > this.keywordDensity * 1.5) {
                optimizedContent = this.reduceKeywordDensity(content, primaryKeyword, this.keywordDensity);
            }
        }

        // Add secondary keywords naturally
        keywords.slice(1, 3).forEach(keyword => {
            optimizedContent = this.addSecondaryKeyword(optimizedContent, keyword);
        });

        return optimizedContent;
    }

    generateMetaDescription(content, keywords) {
        const primaryKeyword = keywords[0];
        let description = content.excerpt || content.content.substring(0, 160);
        
        // Ensure primary keyword is in description
        if (primaryKeyword && !description.toLowerCase().includes(primaryKeyword.toLowerCase())) {
            description = `${primaryKeyword}: ${description}`;
        }
        
        // Optimize length
        if (description.length > this.maxDescriptionLength) {
            description = description.substring(0, this.maxDescriptionLength - 3) + '...';
        }
        
        return description;
    }

    generateStructuredData(content, topic) {
        return {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": content.title,
            "description": content.excerpt,
            "author": {
                "@type": "Organization",
                "name": "NestMate"
            },
            "publisher": {
                "@type": "Organization",
                "name": "NestMate",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://nestmateusa.com/logo.png"
                }
            },
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString(),
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://nestmateusa.com/blog/${topic}`
            },
            "articleSection": this.getCategoryFromTopic(topic),
            "keywords": content.tags ? content.tags.join(', ') : '',
            "wordCount": content.wordCount || content.content.split(' ').length
        };
    }

    generateInternalLinks(content, topic) {
        const internalLinkSuggestions = [
            {
                text: 'home management',
                url: 'dashboard-basic-aws.html',
                context: 'home management system'
            },
            {
                text: 'NestMate features',
                url: 'pricing.html',
                context: 'comprehensive home management'
            },
            {
                text: 'energy audit',
                url: 'energy-audit.html',
                context: 'energy efficiency'
            },
            {
                text: 'maintenance guide',
                url: 'maintenance-guide.html',
                context: 'home maintenance'
            },
            {
                text: 'home value tracker',
                url: 'home-value-tracker.html',
                context: 'property value'
            }
        ];

        // Find relevant internal links based on content
        const relevantLinks = internalLinkSuggestions.filter(link => 
            content.content.toLowerCase().includes(link.context.toLowerCase())
        );

        return relevantLinks.slice(0, 3); // Limit to 3 internal links
    }

    calculateSEOScore(content) {
        let score = 0;
        const maxScore = 100;

        // Title optimization (20 points)
        if (content.title && content.title.length <= this.maxTitleLength) {
            score += 20;
        } else if (content.title && content.title.length <= this.maxTitleLength * 1.2) {
            score += 15;
        }

        // Meta description (15 points)
        if (content.metaDescription && content.metaDescription.length <= this.maxDescriptionLength) {
            score += 15;
        } else if (content.metaDescription && content.metaDescription.length <= this.maxDescriptionLength * 1.2) {
            score += 10;
        }

        // Content length (15 points)
        const wordCount = content.content.split(' ').length;
        if (wordCount >= 300 && wordCount <= 2000) {
            score += 15;
        } else if (wordCount >= 200 && wordCount <= 3000) {
            score += 10;
        }

        // Keyword density (20 points)
        if (content.seo && content.seo.keywordDensity >= 0.01 && content.seo.keywordDensity <= 0.03) {
            score += 20;
        } else if (content.seo && content.seo.keywordDensity >= 0.005 && content.seo.keywordDensity <= 0.05) {
            score += 15;
        }

        // Heading structure (15 points)
        if (content.seo && content.seo.headingStructure.h1Count === 1 && content.seo.headingStructure.h2Count >= 2) {
            score += 15;
        } else if (content.seo && content.seo.headingStructure.h1Count === 1) {
            score += 10;
        }

        // Internal links (10 points)
        if (content.seo && content.seo.internalLinks >= 2) {
            score += 10;
        } else if (content.seo && content.seo.internalLinks >= 1) {
            score += 5;
        }

        // Readability (5 points)
        if (content.seo && content.seo.readabilityScore >= 60) {
            score += 5;
        }

        return Math.min(score, maxScore);
    }

    calculateKeywordDensity(content, keyword) {
        const words = content.toLowerCase().split(/\s+/);
        const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length;
        return keywordCount / words.length;
    }

    increaseKeywordDensity(content, keyword, targetDensity) {
        // Add keyword naturally in appropriate places
        const sentences = content.split('.');
        const keywordCount = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
        const targetCount = Math.ceil(content.split(' ').length * targetDensity);
        
        if (keywordCount < targetCount) {
            // Add keyword to a few strategic sentences
            const sentencesToModify = Math.min(2, targetCount - keywordCount);
            for (let i = 0; i < sentencesToModify; i++) {
                const randomIndex = Math.floor(Math.random() * sentences.length);
                if (!sentences[randomIndex].toLowerCase().includes(keyword.toLowerCase())) {
                    sentences[randomIndex] += ` This ${keyword} approach ensures optimal results.`;
                }
            }
        }
        
        return sentences.join('.');
    }

    reduceKeywordDensity(content, keyword, targetDensity) {
        // Replace some keyword instances with synonyms
        const synonyms = this.getKeywordSynonyms(keyword);
        const keywordRegex = new RegExp(keyword, 'gi');
        const matches = content.match(keywordRegex);
        
        if (matches && matches.length > content.split(' ').length * targetDensity * 1.5) {
            const replaceCount = Math.floor(matches.length * 0.3); // Replace 30% with synonyms
            let replacementCount = 0;
            
            content = content.replace(keywordRegex, (match) => {
                if (replacementCount < replaceCount && synonyms.length > 0) {
                    replacementCount++;
                    return synonyms[Math.floor(Math.random() * synonyms.length)];
                }
                return match;
            });
        }
        
        return content;
    }

    addSecondaryKeyword(content, keyword) {
        // Add secondary keyword once in a natural way
        if (!content.toLowerCase().includes(keyword.toLowerCase())) {
            const sentences = content.split('.');
            const randomIndex = Math.floor(Math.random() * sentences.length);
            sentences[randomIndex] += ` Additionally, ${keyword} considerations are important.`;
            return sentences.join('.');
        }
        return content;
    }

    getKeywordSynonyms(keyword) {
        const synonymMap = {
            'home management': ['property management', 'house care', 'home maintenance'],
            'energy efficiency': ['energy savings', 'power efficiency', 'energy conservation'],
            'home security': ['home safety', 'property security', 'home protection'],
            'smart home': ['home automation', 'connected home', 'intelligent home'],
            'maintenance': ['upkeep', 'care', 'servicing'],
            'improvement': ['enhancement', 'upgrade', 'renovation']
        };
        
        return synonymMap[keyword.toLowerCase()] || [];
    }

    analyzeHeadingStructure(content) {
        const h1Matches = content.match(/^#\s+(.+)$/gm) || [];
        const h2Matches = content.match(/^##\s+(.+)$/gm) || [];
        const h3Matches = content.match(/^###\s+(.+)$/gm) || [];
        
        return {
            h1Count: h1Matches.length,
            h2Count: h2Matches.length,
            h3Count: h3Matches.length,
            hasProperStructure: h1Matches.length === 1 && h2Matches.length >= 2
        };
    }

    countInternalLinks(content) {
        const internalLinkRegex = /\[([^\]]+)\]\([^)]*\.html\)/g;
        const matches = content.match(internalLinkRegex) || [];
        return matches.length;
    }

    countExternalLinks(content) {
        const externalLinkRegex = /\[([^\]]+)\]\(https?:\/\/[^)]+\)/g;
        const matches = content.match(externalLinkRegex) || [];
        return matches.length;
    }

    checkImageOptimization(content) {
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        const matches = content.match(imageRegex) || [];
        
        return {
            imageCount: matches.length,
            hasAltText: matches.every(match => match.includes('![') && match.includes('](')),
            optimized: matches.length <= 5 && matches.every(match => match.includes('![') && match.includes(']('))
        };
    }

    calculateReadabilityScore(content) {
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = content.split(/\s+/).filter(w => w.length > 0);
        const syllables = words.reduce((total, word) => total + this.countSyllables(word), 0);
        
        const avgWordsPerSentence = words.length / sentences.length;
        const avgSyllablesPerWord = syllables / words.length;
        
        // Flesch Reading Ease Score
        const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
        
        return Math.max(0, Math.min(100, score));
    }

    countSyllables(word) {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        
        const vowels = 'aeiouy';
        let syllableCount = 0;
        let previousWasVowel = false;
        
        for (let i = 0; i < word.length; i++) {
            const isVowel = vowels.includes(word[i]);
            if (isVowel && !previousWasVowel) {
                syllableCount++;
            }
            previousWasVowel = isVowel;
        }
        
        // Handle silent 'e'
        if (word.endsWith('e')) {
            syllableCount--;
        }
        
        return Math.max(1, syllableCount);
    }

    getPrimaryKeyword(topic) {
        const keywordMap = {
            'home-management': 'home management',
            'home-improvement': 'home improvement',
            'energy-efficiency': 'energy efficiency',
            'home-security': 'home security',
            'maintenance': 'home maintenance',
            'smart-home': 'smart home',
            'real-estate': 'real estate',
            'construction': 'construction',
            'diy-projects': 'diy projects',
            'home-finance': 'home finance'
        };
        
        return keywordMap[topic] || 'home management';
    }

    getCategoryFromTopic(topic) {
        const categoryMap = {
            'home-management': 'Home Management',
            'home-improvement': 'Home Improvement',
            'energy-efficiency': 'Energy Efficiency',
            'home-security': 'Home Security',
            'maintenance': 'Maintenance',
            'smart-home': 'Smart Home',
            'real-estate': 'Real Estate',
            'construction': 'Construction',
            'diy-projects': 'DIY Projects',
            'home-finance': 'Home Finance'
        };
        
        return categoryMap[topic] || 'Home Management';
    }

    isTitleOptimized(title, keyword) {
        return title && 
               title.length <= this.maxTitleLength && 
               title.toLowerCase().includes(keyword.toLowerCase());
    }

    isMetaDescriptionOptimized(description) {
        return description && 
               description.length <= this.maxDescriptionLength && 
               description.length >= 120;
    }

    generateSEOReport(content) {
        return {
            title: content.title,
            seoScore: content.seoScore,
            recommendations: this.generateSEORecommendations(content),
            keywordAnalysis: this.analyzeKeywords(content),
            technicalSEO: this.checkTechnicalSEO(content),
            contentQuality: this.assessContentQuality(content)
        };
    }

    generateSEORecommendations(content) {
        const recommendations = [];
        
        if (content.seoScore < 70) {
            recommendations.push('Improve SEO score by optimizing title and meta description');
        }
        
        if (content.seo.keywordDensity < 0.01) {
            recommendations.push('Increase keyword density to improve search rankings');
        }
        
        if (content.seo.headingStructure.h1Count !== 1) {
            recommendations.push('Ensure exactly one H1 tag for better SEO structure');
        }
        
        if (content.seo.internalLinks < 2) {
            recommendations.push('Add more internal links to improve site navigation');
        }
        
        if (content.seo.readabilityScore < 60) {
            recommendations.push('Improve content readability for better user experience');
        }
        
        return recommendations;
    }

    analyzeKeywords(content) {
        const words = content.content.toLowerCase().split(/\s+/);
        const wordFreq = {};
        
        words.forEach(word => {
            if (word.length > 3) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });
        
        const sortedWords = Object.entries(wordFreq)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        return {
            topKeywords: sortedWords,
            keywordDiversity: Object.keys(wordFreq).length,
            keywordDensity: content.seo.keywordDensity
        };
    }

    checkTechnicalSEO(content) {
        return {
            titleLength: content.title.length,
            titleOptimized: content.title.length <= this.maxTitleLength,
            metaDescriptionLength: content.metaDescription.length,
            metaDescriptionOptimized: content.metaDescription.length <= this.maxDescriptionLength,
            contentLength: content.content.length,
            wordCount: content.content.split(' ').length,
            hasStructuredData: !!content.structuredData,
            internalLinks: content.seo.internalLinks,
            externalLinks: content.seo.externalLinks
        };
    }

    assessContentQuality(content) {
        return {
            readabilityScore: content.seo.readabilityScore,
            headingStructure: content.seo.headingStructure,
            imageOptimization: content.seo.imagesOptimized,
            contentDepth: content.content.length > 1000 ? 'Comprehensive' : 'Basic',
            engagementPotential: this.calculateEngagementPotential(content)
        };
    }

    calculateEngagementPotential(content) {
        let score = 0;
        
        // Check for engaging elements
        if (content.content.includes('?')) score += 20; // Questions
        if (content.content.includes('!')) score += 10; // Exclamations
        if (content.content.includes('**')) score += 15; // Bold text
        if (content.content.includes('*')) score += 10; // Italics
        if (content.content.includes('- ')) score += 15; // Lists
        if (content.content.includes('##')) score += 20; // Subheadings
        
        return Math.min(100, score);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoblogSEOOptimizer;
} else {
    window.AutoblogSEOOptimizer = AutoblogSEOOptimizer;
}
