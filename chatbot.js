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
    function addMessage(text, className, html = false) {
        const div = document.createElement('div');
        div.className = className;
        if (html) div.innerHTML = text;
        else div.textContent = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    // Process user input
    function processMessage(text) {
        if (text.includes('service')) {
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
                            <div class="service-card">
                                <img src="${service.image}" style="width:70px;height:70px;float:left;margin-right:10px;">
                                <strong>${service.title}</strong><br>
                                <small>${service.shortDescription}</small><br>
                                <button class="service-chat-btn" data-id="${service.id}">Read More</button>
                                <button class="book-service-btn" data-title="${service.title}">Book Now</button>
                            </div>
                        `;
                        addMessage(content, 'bot-message', true);
                    });
                });
        } else if (text.includes('book')) {
            showPage('booking');
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
                    const detailContent = `
                        <h2>${service.title}</h2>
                        <img src="${service.image}" style="max-width:100%;margin:20px 0;">
                        <p>${service.fullDescription}</p>
                        <h4>Includes:</h4>
                        <ul>${service.includes.map(item => `<li>${item}</li>`).join('')}</ul>
                    `;
                    document.querySelector('.service-detail-content').innerHTML = detailContent;
                    showPage('service-detail');
                });
        }

        if (e.target.classList.contains('book-service-btn')) {
            const serviceName = e.target.dataset.title;
            addMessage(`Booking form opened for ${serviceName}.`, 'bot-message');
            showPage('booking');
        }
    });

    // Show specific page
    function showPage(page) {
        if (page === 'booking') {
            document.getElementById('bookingForm').reset(); // Reset the form
            document.getElementById('booking').style.display = 'block';
            container.style.display = 'none';
            document.getElementById('service-detail').style.display = 'none';
            document.getElementById('our-services').style.display = 'none';
        } else if (page === 'service-detail') {
            document.getElementById('service-detail').style.display = 'block';
            container.style.display = 'none';
            document.getElementById('booking').style.display = 'none';
            document.getElementById('our-services').style.display = 'none';
        } else {
            container.style.display = 'flex';
            document.getElementById('booking').style.display = 'none';
            document.getElementById('service-detail').style.display = 'none';
            document.getElementById('our-services').style.display = 'block';
        }
    }

    // Handle booking form submission
    document.getElementById('bookingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addMessage('Your booking has been submitted!', 'bot-message');
        showPage('our-services'); // Go back to services
    });

    // WhatsApp Button
    document.getElementById('whatsapp-chat').addEventListener('click', () => {
        window.open('https://wa.me/254712328599', '_blank');
    });
});

