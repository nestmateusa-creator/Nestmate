// --- Embeddable Chatbot Widget Logic ---
const chatbotHTML = `
  <div class="chatbot-container">
    <div class="chatbot-header">NestMate AI Chatbot [DEBUG]</div>
    <div id="chatbotMessages" class="chatbot-messages"></div>
    <form id="chatbotForm" class="chatbot-input-bar" autocomplete="off">
      <div class="chatbar-section">
        <input id="chatbotInput" type="text" placeholder="Type your reply..." autocomplete="off" />
      </div>
      <button type="submit">Send</button>
    </form>
  </div>
`;

const chatbotCSS = `
  .chatbot-container.collapsed .chatbot-input-bar,
  .chatbot-container.collapsed .chatbar-section {
    display: none !important;
  }
  .chatbot-container.collapsed .chatbot-messages {
    display: none !important;
  }
  .chatbot-container.collapsed {
    min-height: 0 !important;
    overflow: hidden !important;
  }
  .chatbot-container {
    position: fixed;
    right: 32px;
    bottom: 32px;
    width: 360px !important;
    height: 420px !important;
    min-width: 360px !important;
    min-height: 420px !important;
    border-radius: 18px !important;
    box-shadow: 0 4px 24px rgba(37,99,235,0.10) !important;
    background: #fff !important;
    border: 1.5px solid #2563eb !important;
    display: block !important;
    overflow: visible !important;
    z-index: 10000;
  }
  .chatbot-header {
    padding: 12px 16px;
    font-weight: bold;
    background: #2563eb;
    color: #fff;
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    font-size: 1.15rem;
    letter-spacing: 0.02em;
  }
  .chatbot-messages {
    height: 260px;
    overflow-y: auto;
    padding: 12px;
    background: #f3f4f6;
    font-size: 1.02rem;
    border-bottom: 1px solid #e5e7eb;
  }
  .chatbot-message {
    margin-bottom: 10px;
    padding: 8px 12px;
    border-radius: 10px;
    background: #e0e7ff;
    color: #222;
    max-width: 90%;
    word-break: break-word;
  }
  .chatbot-message.bot {
    background: #2563eb;
    color: #fff;
    align-self: flex-start;
  }
  .chatbot-message.user {
    background: #fff;
    color: #222;
    align-self: flex-end;
    border: 1px solid #2563eb22;
  }
  .chatbot-input-bar {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
    background: #fff;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    border-top: 1px solid #e5e7eb;
  }
  .chatbar-section {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .chatbar-section input {
    flex: 1;
    padding: 8px 12px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    font-size: 1.08rem;
    outline: none;
    transition: border 0.18s;
  }
  .chatbar-section input:focus {
    border: 1.5px solid #2563eb;
  }
  .chatbot-input-bar button {
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 0 22px;
    font-size: 1.08rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.18s;
    align-self: flex-end;
  }
  .chatbot-input-bar button:hover {
    background: #1d4ed8;
  }
`;

async function injectChatbot() {
  const container = document.getElementById('nestmate-chatbot');
  if (!container) {
    document.body.insertAdjacentHTML('beforeend', '<div style="position:fixed;bottom:24px;right:24px;z-index:99999;background:#f00;color:#fff;padding:24px;font-size:2rem;">[DEBUG] Chatbot container not found</div>');
    return;
  }
  // Inject CSS
  if (!document.getElementById('nestmate-chatbot-style')) {
    const style = document.createElement('style');
    style.id = 'nestmate-chatbot-style';
    style.textContent = chatbotCSS;
    document.head.appendChild(style);
  }
  // Inject HTML
  container.innerHTML = chatbotHTML;

  // --- Chatbot Logic ---
  const chatbotForm = container.querySelector('#chatbotForm');
  const chatbotInput = container.querySelector('#chatbotInput');
  const chatbotMessages = container.querySelector('#chatbotMessages');

  // Collapsible button
  let toggleBtn = document.createElement('button');
  toggleBtn.id = 'nestmate-chatbot-toggle';
  toggleBtn.title = 'Collapse/Expand Chatbot';
  toggleBtn.innerHTML = '&#8211;';
  toggleBtn.style.position = 'absolute';
  toggleBtn.style.top = '8px';
  toggleBtn.style.right = '8px';
  toggleBtn.style.background = '#2563eb';
  toggleBtn.style.color = '#fff';
  toggleBtn.style.border = 'none';
  toggleBtn.style.borderRadius = '50%';
  toggleBtn.style.width = '32px';
  toggleBtn.style.height = '32px';
  toggleBtn.style.display = 'flex';
  toggleBtn.style.alignItems = 'center';
  toggleBtn.style.justifyContent = 'center';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.zIndex = '10001';
  toggleBtn.style.fontSize = '1.3rem';
  toggleBtn.style.boxShadow = '0 2px 8px #2563eb22';
  toggleBtn.style.transition = 'background 0.18s';
  container.querySelector('.chatbot-container').appendChild(toggleBtn);
  let collapsed = false;
  toggleBtn.onclick = function() {
  const chatbotContainer = container.querySelector('.chatbot-container');
  collapsed = !collapsed;
  if (collapsed) {
    chatbotContainer.classList.add('collapsed');
    chatbotContainer.style.height = '56px';
    chatbotContainer.style.width = '56px';
    chatbotContainer.style.minWidth = '56px';
    chatbotContainer.style.maxWidth = '56px';
    chatbotContainer.style.borderRadius = '50%';
    chatbotContainer.style.boxShadow = 'none';
    chatbotContainer.style.background = 'transparent';
    chatbotContainer.style.overflow = 'hidden';
    toggleBtn.innerHTML = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:auto;"><polygon points="24,8 8,24 12,24 12,40 36,40 36,24 40,24" fill="#2563eb" stroke="#2563eb" stroke-width="2"/><rect x="16" y="28" width="16" height="10" rx="2.5" fill="#fff"/><ellipse cx="24" cy="33" rx="5" ry="2.5" fill="#2563eb"/><rect x="21" y="32" width="6" height="2" rx="1" fill="#fff"/><path d="M24 36 Q26 37 28 36" stroke="#2563eb" stroke-width="1.5" fill="none"/></svg>`;
    toggleBtn.style.background = 'transparent';
    toggleBtn.style.border = 'none';
    toggleBtn.style.width = '100%';
    toggleBtn.style.height = '100%';
    toggleBtn.style.borderRadius = '0';
    toggleBtn.style.padding = '0';
    toggleBtn.style.boxShadow = 'none';
    toggleBtn.style.display = 'block';
    toggleBtn.style.backgroundImage = 'none';
    toggleBtn.style.position = 'absolute';
    toggleBtn.style.top = 'auto';
    toggleBtn.style.bottom = '8px';
    toggleBtn.style.left = 'auto';
    toggleBtn.style.right = '8px';
    toggleBtn.style.transform = '';
    toggleBtn.style.zIndex = '10002';
    toggleBtn.style.boxShadow = 'none';
  } else {
    chatbotContainer.classList.remove('collapsed');
    chatbotContainer.style.height = '420px';
    chatbotContainer.style.width = '';
    chatbotContainer.style.minWidth = '';
    chatbotContainer.style.maxWidth = '';
    chatbotContainer.style.borderRadius = '18px';
    chatbotContainer.style.boxShadow = '0 4px 24px rgba(37,99,235,0.10)';
    chatbotContainer.style.overflow = '';
    toggleBtn.innerHTML = '&#8211;';
    toggleBtn.style.position = 'absolute';
    toggleBtn.style.top = '8px';
    toggleBtn.style.right = '8px';
    toggleBtn.style.left = '';
    toggleBtn.style.bottom = '';
    toggleBtn.style.transform = '';
    toggleBtn.style.zIndex = '10001';
    toggleBtn.style.boxShadow = '0 2px 8px #2563eb22';
  }
      // Show all children except toggleBtn
      Array.from(chatbotContainer.children).forEach(child => {
        if (child !== toggleBtn) {
          child.style.display = '';
        }
      });
      if (chatbarSection) chatbarSection.style.display = '';
      if (chatbotInputBar) chatbotInputBar.style.display = '';
      toggleBtn.innerHTML = '&#8211;';
      toggleBtn.style.position = 'absolute';
      toggleBtn.style.top = '8px';
      toggleBtn.style.right = '8px';
      toggleBtn.style.left = '';
      toggleBtn.style.bottom = '';
      toggleBtn.style.transform = '';
      toggleBtn.style.zIndex = '10001';
      toggleBtn.style.boxShadow = '0 2px 8px #2563eb22';
    }
  };

  // Message logic
  function addMessage(text, sender = "user") {
    const msgDiv = document.createElement('div');
    msgDiv.className = "chatbot-message " + sender;
    msgDiv.textContent = text;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Initial greeting
  function showInitialGreeting() {
    chatbotMessages.innerHTML = "";
    addMessage(
      "🌟 Welcome to NestMate! I'm your friendly AI assistant. Ask me anything about your home, our features, or pricing. I'm here to help make your home management easier and smarter! [DEBUG]",
      "bot"
    );
  }
  showInitialGreeting();

  // Simple AI reply (stub, replace with OpenAI/Firebase integration as needed)
  async function sendMessageToAI(message) {
    // Replace with real OpenAI/Firebase logic
    return "(AI reply) You said: " + message;
  }

  chatbotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMsg = chatbotInput.value.trim();
    if (!userMsg) return;
    addMessage(userMsg, "user");
    chatbotInput.value = "";
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'chatbot-message bot';
    loadingMsg.textContent = '...';
    chatbotMessages.appendChild(loadingMsg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    try {
      const botReply = await sendMessageToAI(userMsg);
      if (loadingMsg.parentNode) loadingMsg.parentNode.removeChild(loadingMsg);
      addMessage(botReply, "bot");
    } catch (err) {
      if (loadingMsg.parentNode) loadingMsg.parentNode.removeChild(loadingMsg);
      addMessage("Sorry, there was an error processing your request.", "bot");
    }
  });

// Auto-inject on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectChatbot);
} else {
  injectChatbot();
}
