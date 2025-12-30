document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('chatbot-toggle');
  const container = document.getElementById('chatbot-container');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');
  const options = document.querySelectorAll('#chatbot-options button');
  const bookingForm = document.getElementById('bookingForm');

  /* ===== GLOBAL PAGE NAVIGATION ===== */
  window.showPage = function(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
    window.scrollTo(0, 0);
    history.replaceState(null, '', `#${pageId}`);
  };

  /* ===== TOGGLE CHATBOT ===== */
  toggle.addEventListener('click', () => container.style.display = 'flex');
  closeBtn.addEventListener('click', () => container.style.display = 'none');

  /* ===== SEND MESSAGE ===== */
  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user-message');
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    setTimeout(() => processMessage(text.toLowerCase()), 300);
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
  });

  /* ===== OPTION BUTTONS ===== */
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

  /* ===== ADD MESSAGE ===== */
  function addMessage(text, className, html = false) {
    const div = document.createElement('div');
    div.className = className;
    if (html) div.innerHTML = text;
    else div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  /* ===== PROCESS USER INPUT ===== */
  function processMessage(text) {
    if (text.includes('service') || text.includes('services')) {
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
      window.showPage('booking');
      addMessage('Booking form opened.', 'bot-message');

    } else if (text.includes('location')) {
      window.showPage('location');
      addMessage('Our location is Naivasha Road, Dagoretti Corner next to Shell petrol station.', 'bot-message');

    } else if (text.includes('contact')) {
      window.showPage('contact');
      addMessage('Call 0712328599 or email info@hybridservice.com.', 'bot-message');

    } else {
      addMessage('Try typing: services, book, location, or contact.', 'bot-message');
    }
  }

  /* ===== EVENT DELEGATION FOR DYNAMIC BUTTONS ===== */
  messages.addEventListener('click', e => {

    // Read More inside chatbot
    if (e.target.classList.contains('service-chat-btn')) {
      const id = e.target.dataset.id;

      fetch('services.json')
        .then(res => res.json())
        .then(data => {
          const service = data.find(s => s.id === id);
          if (!service) return;

          const detail = document.getElementById('service-detail');
          detail.querySelector('.container').innerHTML = `
            <h2>${service.title}</h2>
            <img src="${service.image}" style="max-width:100%;margin:20px 0;">
            <p>${service.fullDescription}</p>
            <button class="back-services-btn">Back to Our Services</button>
          `;
          window.showPage('service-detail');
        });
    }

    // Book Now inside chatbot
    if (e.target.classList.contains('book-service-btn')) {
      window.showPage('booking');

      if (bookingForm) {
        const msg = bookingForm.querySelector('textarea[name="message"]');
        if (msg) msg.value = `Booking request for: ${e.target.dataset.title}`;
      }

      addMessage(`Booking form opened for ${e.target.dataset.title}`, 'bot-message');
    }

    /// Delegated click inside chatbot messages
messages.addEventListener('click', e => {
  // Back to Our Services button
  if (e.target.classList.contains('back-services-btn')) {
    window.showPage('our-services'); // make sure your "our-services" section has id="our-services"
  }
});

   
