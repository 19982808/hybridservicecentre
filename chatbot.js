document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('chatbot-toggle');
    const container = document.getElementById('chatbot-container');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');
    const options = document.querySelectorAll('#chatbot-options button');
    let servicesCache = [];

    // Toggle chatbot visibility
    toggle.addEventListener('click', () => container.style.display = 'flex');
    closeBtn.addEventListener('click', () => container.style.display = 'none');

    // Send message function
    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        addMessage(text, 'user-message');
        input.value = '';
        messages.scrollTop = messages.scrollHeight;
        setTimeout(() => processMessage(text.toLowerCase()), 400);
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage();
    });

    // Add message to chat
    function addMessage(text, className) {
        const div = document.createElement('div');
        div.className = className;
        div.textContent = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    // Process user input
    function processMessage(text) {
        if (text.includes('services')) {
            addMessage('Here are our services: Service 1, Service 2, Service 3.', 'bot-message');
        } else if (text.includes('book')) {
            addMessage('Booking form opened. Please provide your details.', 'bot-message');
        } else if (text.includes('location')) {
            addMessage('Our location is at Naivasha road, Dagoretti Corner.', 'bot-message');
        } else if (text.includes('contact')) {
            addMessage('You can contact us at 0712328599 or info@hybridservice.com.', 'bot-message');
        } else {
            addMessage('Try typing: services, book, location, or contact.', 'bot-message');
        }
    }

    // Option buttons functionality
    options.forEach(btn => {
        btn.addEventListener('click', () => {
            const option = btn.dataset.option;
            if (option === 'services') {
                addMessage('Here are our services: Service 1, Service 2, Service 3.', 'bot-message');
            } else if (option === 'book') {
                addMessage('Booking form opened. Please provide your details.', 'bot-message');
            } else if (option === 'location') {
                addMessage('Our location is at Naivasha road, Dagoretti Corner.', 'bot-message');
            } else if (option === 'contact') {
                addMessage('You can contact us at 0712328599 or info@hybridservice.com.', 'bot-message');
            }
        });
    });
});
