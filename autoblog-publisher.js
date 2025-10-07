class AutoblogPublisher {
    constructor() {
        this.publishedPosts = [];
        this.scheduledPosts = [];
        this.templates = this.initializeBlogTemplates();
        this.initializeScheduler();
    }

    initializeBlogTemplates() {
        return {
            'home-management': {
                filename: 'blog-home-management-{id}.html',
                category: 'Home Management',
                icon: 'fas fa-home',
                color: '#2563eb'
            },
            'home-improvement': {
                filename: 'blog-home-improvement-{id}.html',
                category: 'Home Improvement',
                icon: 'fas fa-tools',
                color: '#059669'
            },
            'energy-efficiency': {
                filename: 'blog-energy-efficiency-{id}.html',
                category: 'Energy Efficiency',
                icon: 'fas fa-leaf',
                color: '#22c55e'
            },
            'home-security': {
                filename: 'blog-home-security-{id}.html',
                category: 'Home Security',
                icon: 'fas fa-shield-alt',
                color: '#ef4444'
            },
            'maintenance': {
                filename: 'blog-maintenance-{id}.html',
                category: 'Maintenance',
                icon: 'fas fa-cogs',
                color: '#f59e0b'
            },
            'smart-home': {
                filename: 'blog-smart-home-{id}.html',
                category: 'Smart Home',
                icon: 'fas fa-lightbulb',
                color: '#8b5cf6'
            },
            'real-estate': {
                filename: 'blog-real-estate-{id}.html',
                category: 'Real Estate',
                icon: 'fas fa-chart-line',
                color: '#06b6d4'
            },
            'construction': {
                filename: 'blog-construction-{id}.html',
                category: 'Construction',
                icon: 'fas fa-hard-hat',
                color: '#f97316'
            },
            'diy-projects': {
                filename: 'blog-diy-projects-{id}.html',
                category: 'DIY Projects',
                icon: 'fas fa-hammer',
                color: '#84cc16'
            },
            'home-finance': {
                filename: 'blog-home-finance-{id}.html',
                category: 'Home Finance',
                icon: 'fas fa-dollar-sign',
                color: '#10b981'
            }
        };
    }

    initializeScheduler() {
        // Check for scheduled posts every minute
        setInterval(() => {
            this.checkScheduledPosts();
        }, 60000);

        // Load existing scheduled posts
        this.loadScheduledPosts();
    }

    async publishPost(postData) {
        try {
            const template = this.templates[postData.topic] || this.templates['home-management'];
            const filename = template.filename.replace('{id}', Date.now());
            
            const htmlContent = this.generateBlogPostHTML(postData, template);
            
            // In a real implementation, you would save this to your file system
            // For now, we'll simulate the publishing process
            await this.simulatePublishPost(filename, htmlContent);
            
            // Update blog index
            await this.updateBlogIndex(postData, filename);
            
            // Track published post
            this.publishedPosts.push({
                ...postData,
                filename,
                publishedAt: new Date().toISOString(),
                status: 'published'
            });
            
            this.savePublishedPosts();
            
            return {
                success: true,
                filename,
                message: 'Post published successfully!'
            };
            
        } catch (error) {
            console.error('Error publishing post:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    generateBlogPostHTML(postData, template) {
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${postData.title} - NestMate Blog</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #64748b;
            --success: #22c55e;
            --warning: #f59e0b;
            --error: #ef4444;
            --background: #f8fafc;
            --surface: #ffffff;
            --text: #1e293b;
            --text-light: #64748b;
            --border: #e2e8f0;
            --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: var(--text);
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary);
            text-decoration: none;
        }

        .logo i {
            font-size: 2rem;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }

        .nav-links a {
            color: var(--text);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .nav-links a:hover {
            color: var(--primary);
        }

        .main {
            padding: 4rem 0;
        }

        .article {
            background: var(--surface);
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: var(--shadow-lg);
        }

        .article-header {
            background: linear-gradient(135deg, ${template.color} 0%, ${this.darkenColor(template.color, 20)} 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }

        .article-meta {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            opacity: 0.9;
        }

        .article-title {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            line-height: 1.2;
        }

        .article-excerpt {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
        }

        .article-content {
            padding: 3rem 2rem;
        }

        .article-content h2 {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text);
            margin: 2rem 0 1rem 0;
            border-left: 4px solid ${template.color};
            padding-left: 1rem;
        }

        .article-content h3 {
            font-size: 1.4rem;
            font-weight: 600;
            color: var(--text);
            margin: 1.5rem 0 0.75rem 0;
        }

        .article-content p {
            font-size: 1.1rem;
            line-height: 1.7;
            color: var(--text);
            margin-bottom: 1.5rem;
        }

        .article-content ul {
            margin: 1rem 0 1.5rem 2rem;
        }

        .article-content li {
            font-size: 1.1rem;
            line-height: 1.6;
            color: var(--text);
            margin-bottom: 0.5rem;
        }

        .back-to-blog {
            text-align: center;
            margin-bottom: 2rem;
        }

        .back-to-blog a {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .back-to-blog a:hover {
            color: var(--primary-dark);
        }

        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 2rem;
        }

        .tag {
            background: var(--background);
            color: var(--text-light);
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.9rem;
            font-weight: 500;
        }

        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }

            .article-title {
                font-size: 2rem;
            }

            .article-meta {
                flex-direction: column;
                gap: 0.5rem;
            }

            .article-content {
                padding: 2rem 1.5rem;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <nav class="nav">
                <a href="index.html" class="logo">
                    <i class="fas fa-home"></i>
                    NestMate
                </a>
                
                <ul class="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="pricing.html">Pricing</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="faq.html">FAQ</a></li>
                    <li><a href="blog.html">Blog</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <div class="back-to-blog">
                <a href="blog.html">
                    <i class="fas fa-arrow-left"></i>
                    Back to Blog
                </a>
            </div>

            <article class="article">
                <header class="article-header">
                    <div class="article-meta">
                        <span><i class="fas fa-calendar"></i> ${currentDate}</span>
                        <span><i class="fas fa-user"></i> NestMate Team</span>
                        <span><i class="fas fa-clock"></i> ${Math.ceil(postData.wordCount / 200)} min read</span>
                    </div>
                    <h1 class="article-title">${postData.title}</h1>
                    <p class="article-excerpt">${postData.excerpt}</p>
                </header>

                <div class="article-content">
                    ${this.formatContentForHTML(postData.content)}
                    
                    <div class="tags">
                        ${postData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </article>
        </div>
    </main>
</body>
</html>`;
    }

    formatContentForHTML(content) {
        return content
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/## (.*?)(?=\n|$)/g, '<h2>$1</h2>')
            .replace(/### (.*?)(?=\n|$)/g, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^- (.*?)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/<p><h2>/g, '<h2>')
            .replace(/<\/h2><\/p>/g, '</h2>')
            .replace(/<p><h3>/g, '<h3>')
            .replace(/<\/h3><\/p>/g, '</h3>');
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    async simulatePublishPost(filename, content) {
        // Simulate file creation delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, you would:
        // 1. Save the HTML file to your web server
        // 2. Update your blog index
        // 3. Notify search engines
        // 4. Post to social media
        
        console.log(`Publishing post: ${filename}`);
        console.log(`Content length: ${content.length} characters`);
        
        // For demonstration, we'll store the content in localStorage
        localStorage.setItem(`nestmate-blog-${filename}`, content);
    }

    async updateBlogIndex(postData, filename) {
        // In a real implementation, you would update your main blog.html file
        // to include the new post in the blog grid
        
        const blogEntry = {
            title: postData.title,
            excerpt: postData.excerpt,
            category: postData.category,
            filename: filename,
            publishedAt: new Date().toISOString(),
            wordCount: postData.wordCount,
            tags: postData.tags
        };
        
        // Store in localStorage for demonstration
        const existingEntries = JSON.parse(localStorage.getItem('nestmate-blog-entries') || '[]');
        existingEntries.unshift(blogEntry); // Add to beginning
        localStorage.setItem('nestmate-blog-entries', JSON.stringify(existingEntries));
    }

    checkScheduledPosts() {
        const now = new Date();
        const postsToPublish = this.scheduledPosts.filter(post => {
            const scheduledDate = new Date(post.scheduledDate);
            return scheduledDate <= now && post.status === 'scheduled';
        });

        postsToPublish.forEach(async (post) => {
            const result = await this.publishPost(post);
            if (result.success) {
                post.status = 'published';
                post.publishedAt = new Date().toISOString();
                this.showNotification(`Post "${post.title}" has been published!`);
            } else {
                console.error('Failed to publish post:', result.error);
            }
        });

        if (postsToPublish.length > 0) {
            this.saveScheduledPosts();
        }
    }

    schedulePost(postData, scheduleDate) {
        const scheduledPost = {
            ...postData,
            scheduledDate: scheduleDate,
            status: 'scheduled',
            id: Date.now().toString()
        };

        this.scheduledPosts.push(scheduledPost);
        this.saveScheduledPosts();
        
        return {
            success: true,
            message: `Post scheduled for ${new Date(scheduleDate).toLocaleString()}`
        };
    }

    loadScheduledPosts() {
        const saved = localStorage.getItem('nestmate-autoblog-scheduled');
        if (saved) {
            this.scheduledPosts = JSON.parse(saved);
        }
    }

    saveScheduledPosts() {
        localStorage.setItem('nestmate-autoblog-scheduled', JSON.stringify(this.scheduledPosts));
    }

    loadPublishedPosts() {
        const saved = localStorage.getItem('nestmate-autoblog-published');
        if (saved) {
            this.publishedPosts = JSON.parse(saved);
        }
    }

    savePublishedPosts() {
        localStorage.setItem('nestmate-autoblog-published', JSON.stringify(this.publishedPosts));
    }

    showNotification(message) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #22c55e;
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            font-weight: 600;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Auto-generate content based on trending topics
    async generateTrendingContent() {
        const trendingTopics = [
            'smart home automation',
            'energy efficiency tips',
            'home security systems',
            'sustainable living',
            'home office setup',
            'outdoor living spaces',
            'kitchen renovation',
            'bathroom upgrades',
            'home maintenance',
            'real estate trends'
        ];

        const randomTopic = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
        const audiences = ['homeowners', 'new homeowners', 'home buyers', 'realtors'];
        const randomAudience = audiences[Math.floor(Math.random() * audiences.length)];

        // Generate content for trending topic
        const content = await this.generateContentForTopic(randomTopic, randomAudience);
        
        return {
            topic: randomTopic.replace(/\s+/g, '-'),
            audience: randomAudience,
            content: content,
            scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Schedule for tomorrow
        };
    }

    async generateContentForTopic(topic, audience) {
        // This would integrate with your AI content generation
        // For now, return a placeholder
        return {
            title: `Complete Guide to ${topic} for ${audience}`,
            content: `This is auto-generated content about ${topic} specifically tailored for ${audience}.`,
            excerpt: `Learn everything you need to know about ${topic} as a ${audience}.`,
            category: 'Auto-Generated',
            tags: [topic, audience, 'guide'],
            wordCount: 500
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoblogPublisher;
} else {
    window.AutoblogPublisher = AutoblogPublisher;
}
