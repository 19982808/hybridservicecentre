document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('chatbot-toggle');
    const container = document.getElementById('chatbot-container');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');
    const options = document.querySelectorAll('#chatbot-options button');
    const bookingForm = document.getElementById('booking-form');
    const serviceDetail = document.getElementById('service-detail');

    /* ===== Toggle chatbot ===== */
    toggle.addEventListener('click', () => container.style.display = 'flex');
    closeBtn.addEventListener('click', () => container.style.display = 'none');

    /* ===== Send message ===== */
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

    /* ===== Add message ===== */
    function addMessage(text, className, html = false) {
        const div = document.createElement('div');
        div.className = className;
        if (html) div.innerHTML = text;
        else div.textContent = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    /* ===== Process user input ===== */
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
                            <div style="border:1px solid #ccc; padding:8px; margin:6px 0; border-radius:8px;">
                                <img src="${service.image}" style="width:70px;height:70px;float:left;margin-right:10px;">
                                <strong>${service.title}</strong><br>
                                <small>${service.shortDescription}</small><br>
                                <button class="service-chat-btn" data-id="${service.id}">Read More</button>
                                <button class="book-service-btn" data-title="${service.title}">Book Now</button>
                                <div style="clear:both"></div>
                            </div>
                        `;
                        addMessage(content, 'bot-message', true);
                    });
                });
        } else if (text.includes('book')) {
            showPage('booking-form');
            addMessage('Booking form opened.', 'bot-message');
        } else if (text.includes('location')) {
            addMessage('Our location is:', 'bot-message');
            addMessage('<a href="https://www.google.com/maps/place/Naivasha+Road,+Dagoretti+Corner/@-1.329098,36.726317,17z" target="_blank">Click here to view on Google Maps</a>', 'bot-message', true);
        } else if (text.includes('contact')) {
            addMessage('Call 0712328599 or email info@hybridservice.com.', 'bot-message');
        } else {
            addMessage('Try typing: services, book, location, or contact.', 'bot-message');
        }
    }

    /* ===== Event delegation inside chatbot ===== */
    messages.addEventListener('click', e => {
        /* READ MORE */
        if (e.target.classList.contains('service-chat-btn')) {
            const id = e.target.dataset.id;

            fetch('services.json')
                .then(res => res.json())
                .then(data => {
                    const service = data.find(s => s.id === id);
                    if (!service) return;

                    serviceDetail.querySelector('.container').innerHTML = `
                        <h2>${service.title}</h2>
                        <img src="${service.image}" style="max-width:100%;margin:20px 0;">
                        <p>${service.fullDescription}</p>
                    `;

                    serviceDetail.style.display = 'block'; // Show service detail
                    container.style.display = 'none'; // Hide chatbot
                });
        }

        /* BOOK NOW */
        if (e.target.classList.contains('book-service-btn')) {
            showPage('booking-form');
            const serviceName = e.target.dataset.title;
            document.getElementById('service').value = serviceName; // Set the service name in the booking form
            addMessage(`Booking form opened for ${serviceName}.`, 'bot-message');
        }
    });

    /* Show specific page */
    function showPage(page) {
        if (page === 'booking-form') {
            bookingForm.style.display = 'block';
            container.style.display = 'none';
        } else if (page === 'chatbot-container') {
            container.style.display = 'flex';
            bookingForm.style.display = 'none';
            serviceDetail.style.display = 'none';
        }
    }

    /* Handle booking form submission */
    document.getElementById('form').addEventListener('submit', (e) => {
        e.preventDefault();
        // Handle the booking logic here (e.g., send data to server)
        addMessage('Your booking has been submitted!', 'bot-message');
        showPage('chatbot-container'); // Go back to chatbot
    });

    /* WhatsApp Button */
    document.getElementById('whatsapp-chat').addEventListener('click', () => {
        window.open('https://wa.me/254712328599', '_blank');
    });
});
