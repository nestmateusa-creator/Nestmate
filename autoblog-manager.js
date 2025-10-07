class AutoblogManager {
    constructor() {
        this.currentContent = null;
        this.scheduledPosts = [];
        this.templates = this.initializeTemplates();
        this.initializeEventListeners();
        this.loadScheduledPosts();
        this.updateStats();
    }

    initializeTemplates() {
        return {
            'how-to-guide': {
                title: 'How to {topic}: A Complete Guide for {audience}',
                structure: [
                    'Introduction explaining the importance of {topic}',
                    'Step-by-step instructions with detailed explanations',
                    'Common mistakes to avoid',
                    'Tools and materials needed',
                    'Safety considerations',
                    'Conclusion with key takeaways'
                ],
                keywords: ['how to', 'guide', 'step by step', 'tutorial']
            },
            'product-review': {
                title: '{product} Review: Is It Worth It for {audience}?',
                structure: [
                    'Product overview and key features',
                    'Pros and cons analysis',
                    'Performance evaluation',
                    'Value for money assessment',
                    'Comparison with alternatives',
                    'Final recommendation'
                ],
                keywords: ['review', 'comparison', 'pros and cons', 'recommendation']
            },
            'seasonal-tips': {
                title: '{season} Home Maintenance: Essential Tips for {audience}',
                structure: [
                    'Seasonal challenges and considerations',
                    'Preventive maintenance checklist',
                    'Energy efficiency tips for the season',
                    'Safety considerations',
                    'Budget-friendly improvements',
                    'Professional services to consider'
                ],
                keywords: ['seasonal', 'maintenance', 'tips', 'prevention']
            },
            'maintenance-checklist': {
                title: 'Complete {area} Maintenance Checklist for {audience}',
                structure: [
                    'Importance of regular maintenance',
                    'Detailed checklist with timeframes',
                    'DIY vs professional tasks',
                    'Cost estimates and budgeting',
                    'Warning signs to watch for',
                    'Maintenance schedule template'
                ],
                keywords: ['checklist', 'maintenance', 'schedule', 'prevention']
            },
            'cost-analysis': {
                title: '{topic} Costs: Complete Breakdown for {audience}',
                structure: [
                    'Overview of cost factors',
                    'Detailed cost breakdown',
                    'Regional variations and considerations',
                    'ROI analysis and benefits',
                    'Budgeting tips and financing options',
                    'Cost-saving strategies'
                ],
                keywords: ['cost', 'budget', 'analysis', 'ROI', 'savings']
            },
            'trend-report': {
                title: '{year} {topic} Trends: What {audience} Need to Know',
                structure: [
                    'Current market trends and statistics',
                    'Emerging technologies and innovations',
                    'Consumer behavior changes',
                    'Industry predictions and forecasts',
                    'How trends affect homeowners',
                    'Actionable insights and recommendations'
                ],
                keywords: ['trends', '2024', 'market', 'innovation', 'future']
            }
        };
    }

    initializeEventListeners() {
        // Content generation form
        document.getElementById('contentGeneratorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateContent();
        });

        // Schedule button
        document.getElementById('scheduleBtn').addEventListener('click', () => {
            this.schedulePost();
        });

        // Save draft button
        document.getElementById('saveDraftBtn').addEventListener('click', () => {
            this.saveDraft();
        });

        // Template loading
        document.getElementById('loadTemplateBtn').addEventListener('click', () => {
            this.loadTemplate();
        });

        // Auto-schedule frequency change
        document.getElementById('scheduleFrequency').addEventListener('change', (e) => {
            this.updateAutoSchedule(e.target.value);
        });
    }

    async generateContent() {
        const topic = document.getElementById('topic').value;
        const audience = document.getElementById('audience').value;
        const keywords = document.getElementById('keywords').value;
        const wordCount = document.getElementById('wordCount').value;
        const tone = document.getElementById('tone').value;

        if (!topic || !audience) {
            this.showAlert('Please select both topic and audience', 'error');
            return;
        }

        this.showLoading(true);
        this.hideAlert();

        try {
            // Simulate AI content generation (replace with actual AI API call)
            const content = await this.simulateAIContentGeneration({
                topic,
                audience,
                keywords,
                wordCount: parseInt(wordCount),
                tone
            });

            this.currentContent = content;
            this.displayContentPreview(content);
            this.enableActionButtons();
            this.showAlert('Content generated successfully!', 'success');

        } catch (error) {
            this.showAlert('Error generating content: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async simulateAIContentGeneration(params) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

        const { topic, audience, keywords, wordCount, tone } = params;
        
        // Generate content based on parameters
        const title = this.generateTitle(topic, audience);
        const content = this.generateContentBody(topic, audience, keywords, wordCount, tone);
        
        return {
            title,
            content,
            excerpt: this.generateExcerpt(content),
            category: this.getCategoryFromTopic(topic),
            tags: this.generateTags(topic, keywords),
            wordCount: content.split(' ').length,
            createdAt: new Date().toISOString(),
            status: 'draft'
        };
    }

    generateTitle(topic, audience) {
        const titleTemplates = [
            `Complete Guide to ${this.formatTopic(topic)} for ${this.formatAudience(audience)}`,
            `${this.formatTopic(topic)}: Essential Tips for ${this.formatAudience(audience)}`,
            `How to Master ${this.formatTopic(topic)}: A ${this.formatAudience(audience)} Guide`,
            `${this.formatTopic(topic)} Made Simple for ${this.formatAudience(audience)}`,
            `The Ultimate ${this.formatTopic(topic)} Guide for ${this.formatAudience(audience)}`
        ];
        
        return titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
    }

    generateContentBody(topic, audience, keywords, wordCount, tone) {
        const sections = [
            this.generateIntroduction(topic, audience, tone),
            this.generateMainContent(topic, audience, keywords),
            this.generateTips(topic, audience),
            this.generateConclusion(topic, audience, tone)
        ];

        let content = sections.join('\n\n');
        
        // Adjust word count if needed
        const currentWords = content.split(' ').length;
        if (currentWords < wordCount) {
            content += '\n\n' + this.generateAdditionalContent(topic, audience, wordCount - currentWords);
        }

        return content;
    }

    generateIntroduction(topic, audience, tone) {
        const introductions = {
            professional: `As ${this.formatAudience(audience)}, understanding ${this.formatTopic(topic)} is crucial for maintaining and improving your property. This comprehensive guide will provide you with the knowledge and tools necessary to make informed decisions and achieve optimal results.`,
            friendly: `Hey there, ${this.formatAudience(audience)}! Whether you're new to ${this.formatTopic(topic)} or looking to brush up on your skills, this guide has got you covered. Let's dive in and make your home the best it can be!`,
            expert: `In the realm of ${this.formatTopic(topic)}, ${this.formatAudience(audience)} face unique challenges and opportunities. This expert analysis will provide you with industry insights and proven strategies to maximize your success.`,
            conversational: `So you want to know about ${this.formatTopic(topic)}? You've come to the right place! As ${this.formatAudience(audience)}, you'll find this guide packed with practical advice that you can actually use.`
        };

        return introductions[tone] || introductions.professional;
    }

    generateMainContent(topic, audience, keywords) {
        const contentSections = [
            `## Understanding ${this.formatTopic(topic)}\n\n${this.formatTopic(topic)} involves several key components that ${this.formatAudience(audience)} should be familiar with. The process typically includes planning, implementation, and ongoing maintenance to ensure long-term success.`,
            
            `## Key Benefits for ${this.formatAudience(audience)}\n\nImplementing proper ${this.formatTopic(topic)} practices offers numerous advantages:\n\n- **Cost Savings**: Reduce long-term expenses through preventive measures\n- **Increased Property Value**: Enhance your home's market appeal\n- **Improved Efficiency**: Optimize performance and reduce waste\n- **Peace of Mind**: Know that your property is well-maintained`,
            
            `## Common Challenges and Solutions\n\n${this.formatAudience(audience)} often encounter specific challenges when dealing with ${this.formatTopic(topic)}. Here are the most common issues and their solutions:\n\n1. **Budget Constraints**: Start with high-impact, low-cost improvements\n2. **Time Management**: Create a realistic schedule and stick to it\n3. **Technical Knowledge**: Consider professional consultation for complex tasks\n4. **Maintenance Consistency**: Set up automated reminders and tracking systems`
        ];

        return contentSections.join('\n\n');
    }

    generateTips(topic, audience) {
        const tips = [
            `## Pro Tips for ${this.formatAudience(audience)}\n\nHere are some expert recommendations to help you succeed with ${this.formatTopic(topic)}:\n\n- **Start Small**: Begin with manageable projects to build confidence\n- **Document Everything**: Keep detailed records of all work performed\n- **Regular Inspections**: Schedule routine checks to catch issues early\n- **Professional Consultation**: Don't hesitate to seek expert advice when needed\n- **Stay Informed**: Keep up with industry trends and best practices`,
            
            `## Tools and Resources\n\nHaving the right tools and resources is essential for effective ${this.formatTopic(topic)}:\n\n- **Digital Tools**: Use apps and software to track and manage tasks\n- **Quality Materials**: Invest in durable, high-quality supplies\n- **Safety Equipment**: Always prioritize safety with proper protective gear\n- **Reference Materials**: Keep manuals and guides readily available\n- **Professional Network**: Build relationships with trusted contractors and suppliers`
        ];

        return tips.join('\n\n');
    }

    generateConclusion(topic, audience, tone) {
        const conclusions = {
            professional: `In conclusion, mastering ${this.formatTopic(topic)} requires dedication, knowledge, and the right approach. By following the guidelines outlined in this comprehensive guide, ${this.formatAudience(audience)} can achieve significant improvements in their property management and maintenance practices.`,
            friendly: `There you have it! With these tips and strategies, you're well on your way to becoming a ${this.formatTopic(topic)} expert. Remember, every small step counts, and you've got this!`,
            expert: `The strategies and insights presented in this analysis provide ${this.formatAudience(audience)} with a solid foundation for success in ${this.formatTopic(topic)}. Implementation of these recommendations will yield measurable improvements in both short-term results and long-term value.`,
            conversational: `So there you go! ${this.formatTopic(topic)} doesn't have to be overwhelming. Take it one step at a time, and before you know it, you'll be handling it like a pro. Good luck!`
        };

        return `## Conclusion\n\n${conclusions[tone] || conclusions.professional}`;
    }

    generateAdditionalContent(topic, audience, additionalWords) {
        const additionalSections = [
            `## Frequently Asked Questions\n\n**Q: How often should I perform ${this.formatTopic(topic)}?**\nA: The frequency depends on various factors, but a general rule is to conduct regular inspections and maintenance as recommended by manufacturers and industry standards.`,
            
            `**Q: Can I handle ${this.formatTopic(topic)} myself?**\nA: Many aspects can be handled by ${this.formatAudience(audience)}, but complex or dangerous tasks should be left to professionals.`,
            
            `**Q: What's the most important aspect of ${this.formatTopic(topic)}?**\nA: Consistency and attention to detail are crucial. Regular maintenance and early problem detection can save significant time and money.`
        ];

        return additionalSections.join('\n\n');
    }

    generateExcerpt(content) {
        const sentences = content.split('.').slice(0, 2);
        return sentences.join('.').substring(0, 150) + '...';
    }

    generateTags(topic, keywords) {
        const baseTags = [this.formatTopic(topic), 'home management', 'tips'];
        const keywordTags = keywords ? keywords.split(',').map(k => k.trim()) : [];
        return [...baseTags, ...keywordTags].slice(0, 8);
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
        return categoryMap[topic] || 'General';
    }

    formatTopic(topic) {
        return topic.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatAudience(audience) {
        return audience.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    displayContentPreview(content) {
        const previewContainer = document.getElementById('contentPreview');
        const previewContent = document.getElementById('previewContent');
        
        previewContent.innerHTML = `
            <h3>${content.title}</h3>
            <p><strong>Category:</strong> ${content.category}</p>
            <p><strong>Word Count:</strong> ${content.wordCount}</p>
            <p><strong>Tags:</strong> ${content.tags.join(', ')}</p>
            <hr>
            <div style="max-height: 200px; overflow-y: auto;">
                ${content.content.replace(/\n/g, '<br>')}
            </div>
        `;
        
        previewContainer.style.display = 'block';
    }

    enableActionButtons() {
        document.getElementById('scheduleBtn').disabled = false;
        document.getElementById('saveDraftBtn').disabled = false;
    }

    schedulePost() {
        if (!this.currentContent) {
            this.showAlert('No content to schedule', 'error');
            return;
        }

        const scheduleDate = document.getElementById('scheduleDate').value;
        if (!scheduleDate) {
            this.showAlert('Please select a schedule date', 'error');
            return;
        }

        const scheduledPost = {
            ...this.currentContent,
            scheduledDate: scheduleDate,
            status: 'scheduled',
            id: Date.now().toString()
        };

        this.scheduledPosts.push(scheduledPost);
        this.saveScheduledPosts();
        this.updateScheduleList();
        this.updateStats();
        this.showAlert('Post scheduled successfully!', 'success');
        
        // Reset form
        this.currentContent = null;
        document.getElementById('contentPreview').style.display = 'none';
        document.getElementById('scheduleBtn').disabled = true;
        document.getElementById('saveDraftBtn').disabled = true;
    }

    saveDraft() {
        if (!this.currentContent) {
            this.showAlert('No content to save', 'error');
            return;
        }

        const draft = {
            ...this.currentContent,
            status: 'draft',
            id: Date.now().toString()
        };

        this.scheduledPosts.push(draft);
        this.saveScheduledPosts();
        this.updateScheduleList();
        this.updateStats();
        this.showAlert('Draft saved successfully!', 'success');
        
        // Reset form
        this.currentContent = null;
        document.getElementById('contentPreview').style.display = 'none';
        document.getElementById('scheduleBtn').disabled = true;
        document.getElementById('saveDraftBtn').disabled = true;
    }

    loadTemplate() {
        const templateType = document.getElementById('templateSelect').value;
        if (!templateType) {
            this.showAlert('Please select a template', 'error');
            return;
        }

        const template = this.templates[templateType];
        const topic = document.getElementById('topic').value || 'your topic';
        const audience = document.getElementById('audience').value || 'your audience';

        const templateContent = {
            title: template.title.replace('{topic}', this.formatTopic(topic)).replace('{audience}', this.formatAudience(audience)),
            structure: template.structure.map(section => 
                section.replace('{topic}', this.formatTopic(topic)).replace('{audience}', this.formatAudience(audience))
            ),
            keywords: template.keywords
        };

        this.displayTemplatePreview(templateContent);
    }

    displayTemplatePreview(template) {
        const previewContainer = document.getElementById('templatePreview');
        const templateContent = document.getElementById('templateContent');
        
        templateContent.innerHTML = `
            <h3>${template.title}</h3>
            <h4>Content Structure:</h4>
            <ol>
                ${template.structure.map(section => `<li>${section}</li>`).join('')}
            </ol>
            <h4>Suggested Keywords:</h4>
            <p>${template.keywords.join(', ')}</p>
        `;
        
        previewContainer.style.display = 'block';
    }

    updateScheduleList() {
        const scheduleList = document.getElementById('scheduleList');
        
        if (this.scheduledPosts.length === 0) {
            scheduleList.innerHTML = '<p style="text-align: center; color: var(--text-light);">No scheduled posts</p>';
            return;
        }

        scheduleList.innerHTML = this.scheduledPosts.map(post => `
            <div class="schedule-item">
                <div>
                    <h4>${post.title}</h4>
                    <p>${post.category} • ${post.wordCount} words • ${new Date(post.scheduledDate || post.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="schedule-actions">
                    <span class="status-badge status-${post.status}">${post.status}</span>
                    <button class="btn btn-sm btn-secondary" onclick="autoblogManager.editPost('${post.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="autoblogManager.publishPost('${post.id}')">
                        <i class="fas fa-publish"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="autoblogManager.deletePost('${post.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const total = this.scheduledPosts.length;
        const scheduled = this.scheduledPosts.filter(p => p.status === 'scheduled').length;
        const published = this.scheduledPosts.filter(p => p.status === 'published').length;
        const drafts = this.scheduledPosts.filter(p => p.status === 'draft').length;

        document.getElementById('totalPosts').textContent = total;
        document.getElementById('scheduledPosts').textContent = scheduled;
        document.getElementById('publishedPosts').textContent = published;
        document.getElementById('draftPosts').textContent = drafts;
    }

    editPost(postId) {
        const post = this.scheduledPosts.find(p => p.id === postId);
        if (post) {
            this.currentContent = post;
            this.displayContentPreview(post);
            this.enableActionButtons();
            this.showAlert('Post loaded for editing', 'success');
        }
    }

    publishPost(postId) {
        const postIndex = this.scheduledPosts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
            this.scheduledPosts[postIndex].status = 'published';
            this.scheduledPosts[postIndex].publishedAt = new Date().toISOString();
            this.saveScheduledPosts();
            this.updateScheduleList();
            this.updateStats();
            this.showAlert('Post published successfully!', 'success');
        }
    }

    deletePost(postId) {
        if (confirm('Are you sure you want to delete this post?')) {
            this.scheduledPosts = this.scheduledPosts.filter(p => p.id !== postId);
            this.saveScheduledPosts();
            this.updateScheduleList();
            this.updateStats();
            this.showAlert('Post deleted successfully!', 'success');
        }
    }

    updateAutoSchedule(frequency) {
        if (frequency === 'none') {
            this.showAlert('Auto-scheduling disabled', 'success');
            return;
        }

        // Set up auto-scheduling based on frequency
        const frequencies = {
            daily: 24 * 60 * 60 * 1000,
            weekly: 7 * 24 * 60 * 60 * 1000,
            'bi-weekly': 14 * 24 * 60 * 60 * 1000,
            monthly: 30 * 24 * 60 * 60 * 1000
        };

        this.showAlert(`Auto-scheduling set to ${frequency}`, 'success');
        // In a real implementation, you would set up a cron job or scheduled task here
    }

    loadScheduledPosts() {
        const saved = localStorage.getItem('nestmate-autoblog-posts');
        if (saved) {
            this.scheduledPosts = JSON.parse(saved);
            this.updateScheduleList();
            this.updateStats();
        }
    }

    saveScheduledPosts() {
        localStorage.setItem('nestmate-autoblog-posts', JSON.stringify(this.scheduledPosts));
    }

    showLoading(show) {
        const loader = document.getElementById('generatingLoader');
        const generateBtn = document.getElementById('generateBtn');
        
        if (show) {
            loader.classList.add('show');
            generateBtn.disabled = true;
        } else {
            loader.classList.remove('show');
            generateBtn.disabled = false;
        }
    }

    showAlert(message, type) {
        const alertContainer = document.getElementById('alertContainer');
        const alertClass = type === 'error' ? 'alert-error' : 'alert-success';
        
        alertContainer.innerHTML = `
            <div class="alert ${alertClass}">
                ${message}
            </div>
        `;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideAlert();
        }, 5000);
    }

    hideAlert() {
        document.getElementById('alertContainer').innerHTML = '';
    }
}

// Initialize the autoblog manager when the page loads
let autoblogManager;
document.addEventListener('DOMContentLoaded', () => {
    autoblogManager = new AutoblogManager();
});
