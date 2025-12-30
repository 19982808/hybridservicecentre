// chatbot.js

async function createChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');

    // Show the chatbot when the toggle is clicked
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.style.display = 'flex';
    });

    // Close the chatbot when the close button is clicked
    chatbotClose.addEventListener('click', () => {
        chatbotContainer.style.display = 'none';
    });

    // Function to add a message to the chatbot
    function addMessage(msg, isUser = false) {
        const div = document.createElement('div');
        div.textContent = msg;
        div.style.marginBottom = '0.5rem';
        div.style.textAlign = isUser ? 'right' : 'left';
        chatbotMessages.appendChild(div);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to the bottom
    }

    // Function to create a button
    function addButton(label, callback) {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.marginTop = '0.5rem';
        button.style.cursor = 'pointer';
        button.onclick = callback;
        return button;
    }

    // Send message when the send button is clicked
    chatbotSend.addEventListener('click', async () => {
        const msg = chatbotInput.value.trim();
        if (!msg) return;
        addMessage(msg, true); // Add user's message
        chatbotInput.value = ''; // Clear input
        await respond(msg.toLowerCase()); // Process the user's message
    });

    // Send message when Enter key is pressed
    chatbotInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') chatbotSend.click();
    });

    // Respond to user messages
    async function respond(msg) {
        if (msg.includes('service') || msg.includes('services')) {
            addMessage('You can view our services here:');
            const services = await fetchServices();
            services.forEach(service => {
                const readMoreButton = addButton(`Read More about ${service.title}`, () => {
                    showServiceDetail(service);
                });
                chatbotMessages.appendChild(readMoreButton);
            });
        } else if (msg.includes('book')) {
            addMessage('Would you like to book a service?');
            const bookButton = addButton('Book Now', () => {
                document.getElementById('booking-form').style.display = 'block'; // Show booking form
                chatbotContainer.style.display = 'none'; // Close chatbot
            });
            chatbotMessages.appendChild(bookButton);
        } else if (msg.includes('location')) {
            addMessage('We are located at Naivasha Road, Dagoretti Corner next to Shell petrol station.');
            addMessage('Opening the map...');
            // Open Google Maps with the specified location
            window.open('https://www.google.com/maps?q=Naivasha+Road,+Dagoretti+Corner', '_blank');
        } else if (msg.includes('whatsapp') || msg.includes('wa me')) {
            addMessage('You can chat with us on WhatsApp!');
            const whatsappButton = addButton('WhatsApp Me', () => {
                const message = encodeURIComponent("Hello! I would like to inquire about your services.");
                const phoneNumber = '254712328599'; // Replace with your WhatsApp number
                window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
            });
            chatbotMessages.appendChild(whatsappButton);
        } else {
            addMessage("I'm here to help! You can ask about our services, booking, location, or contact us on WhatsApp.");
        }
    }

    // Fetch services from the JSON file
    async function fetchServices() {
        const res = await fetch('services.json');
        return await res.json();
    }

    // Show detailed information about a service
    function showServiceDetail(service) {
        addMessage(`**${service.title}**: ${service.fullDescription}`);
        addMessage(`Includes: ${service.includes.join(', ')}`);
    }
}

// Call the chatbot function to initialize
createChatbot();
