// chatbot.js

// Simple chatbot functionality
function createChatbot() {
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chatbot';
    chatContainer.style.position = 'fixed';
    chatContainer.style.bottom = '20px';
    chatContainer.style.right = '20px';
    chatContainer.style.width = '300px';
    chatContainer.style.border = '1px solid #ccc';
    chatContainer.style.borderRadius = '5px';
    chatContainer.style.backgroundColor = 'white';
    chatContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    chatContainer.innerHTML = `
        <div style="padding: 10px; border-bottom: 1px solid #ccc;">
            <strong>Chatbot</strong>
        </div>
        <div id="chatMessages" style="max-height: 200px; overflow-y: auto; padding: 10px;"></div>
        <input type="text" id="chatInput" placeholder="Type a message..." style="width: 100%; padding: 5px;"/>
    `;
    document.body.appendChild(chatContainer);

    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const userMessage = chatInput.value;
            chatMessages.innerHTML += `<div><strong>You:</strong> ${userMessage}</div>`;
            chatInput.value = '';

            // Simulate a response
            setTimeout(() => {
                const botResponse = "I'm here to help! What do you need?";
                chatMessages.innerHTML += `<div><strong>Bot:</strong> ${botResponse}</div>`;
                chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
            }, 1000);
        }
    });
}

// Initialize chatbot
createChatbot();
