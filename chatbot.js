document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('chatbot-toggle');
  const container = document.getElementById('chatbot-container');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');
  const options = document.querySelectorAll('#chatbot-options button');
  const bookingForm = document.getElementById('bookingForm');

  // ===== Toggle chatbot =====
  toggle.addEventListener('click', () => container.style.display = 'flex');
  closeBtn.addEventListener('click', () => container.style.display = 'none');

  // ===== Send message =====
  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user-message');
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    setTimeout(() => processMessage(text.toLowerCase()), 400);
  }
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

  // ===== Option buttons =====
  options.forEach(btn => {
    btn.addEventListener('click', () => {
      const option = btn.dataset.option;
      if (btn.id === 'whatsapp-chat') {
        window.open('https://wa.me/254712328599', '_blank');
      } else {
        input.value = option;
        sendMessage();
      }
    });
  });

  // ===== Add message to chat =====
  function addMessage(text, className, html = false) {
    const div = document.createElement('div');
    div.className = className;
    if (html) div.innerHTML = text;
    else div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  // ===== SPA page switching =====
  window.showPage = function(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
    window.scrollTo(0, 0);
    history.replaceState(null, '', `#${pageId}`);
  }

  // ===== Process user input =====
  function processMessage(text) {
    if (text.includes('service') || text.includes('services')) {
      fetch('services.json')
        .then(res => res.json())
        .then(data => {
          if (!data.length) return addMessage('No services available.', 'bot-message');

          addMessage('Here are our main services:', 'bot-message');

          data.forEach(service => {
            const content = `
              <div style="border:1px solid #ccc; padding:8px; margin:5px 0; border-radius:8px; overflow:hidden;">
                <img src="${service.image}" alt="${service.title}" style="width:80px; height:80px; object-fit:contain; float:left; margin-right:10px;">
                <strong>${service.title}</strong><br>
                <small>${service.shortDescription}</small><br>
                <button class="service-chat-btn" data-id="${service.id}">Read More</button>
                <button class="book-service-btn" data-title="${service.title}">Book Now</button>
                <div style="clear:both;"></div>
              </div>
            `;
            addMessage(content, 'bot-message', true);
          });
        });
    } else if (text.includes('book')) {
      showPage('booking');
      addMessage('Booking form is now open. Please fill in your details.', 'bot-message');
    } else if (text.includes('location')) {
      showPage('location');
      addMessage('Our main branch is in Nairobi, Kenya. Check the map above.', 'bot-message');
    } else if (text.includes('contact')) {
      showPage('contact');
      addMessage('You can call 0712328599, email info@hybridservice.com, or click WhatsApp to chat.', 'bot-message');
    } else {
      addMessage('I did not understand. Type "services", "book", "location", or click WhatsApp.', 'bot-message');
    }
  }

  // ===== Event delegation for dynamic buttons inside chatbot =====
  messages.addEventListener('click', e => {
    // Read More
    if (e.target.classList.contains('service-chat-btn')) {
      const id = e.target.dataset.id;
      fetch('services.json')
        .then(res => res.json())
        .then(data => {
          const service = data.find(s => s.id === id);
          if (!service) return;

          const serviceDetail = document.getElementById('service-detail');
          serviceDetail.querySelector('.container').innerHTML = `
            <h2>${service.title}</h2>
            <img src="${service.image}" alt="${service.title}" style="max-width:100%; margin:20px 0;">
            <p>${service.fullDescription}</p>
            <button onclick="showPage('services')">Back to Services</button>
          `;
          showPage('service-detail');
        });
    }

    // Book Now
    if (e.target.classList.contains('book-service-btn')) {
      showPage('booking');
      if (bookingForm) {
        const msgField = bookingForm.querySelector('textarea[name="message"]');
        if (msgField) msgField.value = `Booking request for: ${e.target.dataset.title}`;
      }
      addMessage(`Booking form opened for: ${e.target.dataset.title}`, 'bot-message');
    }
  });

  // ===== Check URL hash on load =====
  if (window.location.hash) {
    const hash = window.location.hash.replace('#', '');
    showPage(hash);
  }
});
