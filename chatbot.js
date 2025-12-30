document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('chatbot-toggle');
    const container = document.getElementById('chatbot-container');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');

    // Toggle chatbot visibility
    toggle.addEventListener('click', () => container.style.display = 'flex');
    closeBtn.addEventListener('click', () => container.style.display = 'none');

    // Send message
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
        if (text.includes('service')) {
            // Fetch services from services.json
            fetch('services.json')
                .then(res => res.json())
                .then(data => {
                    if (!data.length) {
                        addMessage('No services available.', 'bot-message');
                        return;
                    }

                    addMessage('Here are our services:', 'bot-message');
                    data.forEach(service => {
                        const content = `
                            <div>
                                <strong>${service.title}</strong><br>
                                <small>${service.shortDescription}</small><br>
                                <button class="service-chat-btn" data-id="${service.id}">Read More</button>
                                <button class="book-service-btn" data-title="${service.title}">Book Now</button>
                            </div>
                        `;
                        addMessage(content, 'bot-message');
                    });
                });
        } else if (text.includes('book')) {
            addMessage('Booking form opened.', 'bot-message');
        } else if (text.includes('location')) {
            addMessage('Our location is: <a href="https://www.google.com/maps/place/Nairobi,+Kenya" target="_blank">Click here to view on Google Maps</a>', 'bot-message', true);
        } else {
            addMessage('Try typing: services, book, location, or contact.', 'bot-message');
        }
    }

    // Event delegation for service buttons
    messages.addEventListener('click', e => {
        if (e.target.classList.contains('service-chat-btn')) {
            const id = e.target.dataset.id;
            fetch('services.json')
                .then(res => res.json())
                .then(data => {
                    const service = data.find(s => s.id === id);
                    if (!service) return;
                    addMessage(`Service Details: ${service.fullDescription}`, 'bot-message');
                });
        }

        if (e.target.classList.contains('book-service-btn')) {
            const serviceName = e.target.dataset.title;
            addMessage(`Booking form opened for ${serviceName}.`, 'bot-message');
        }
    });

    // WhatsApp Button
    document.getElementById('whatsapp-chat').addEventListener('click', () => {
        window.open('https://wa.me/254712328599', '_blank');
    });
});
