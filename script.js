// ================= GLOBAL FUNCTIONS =================
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');
  window.scrollTo(0, 0);
  history.replaceState(null, '', `#${pageId}`);
}

// Make it global so inline onclick can access
window.showPage = showPage;

function openServicePage(id) {
  fetch('services.json')
    .then(res => res.json())
    .then(data => {
      const service = data.find(s => s.id === id);
      if (service) {
        let serviceDetail = document.getElementById('service-detail');
        if (!serviceDetail) {
          serviceDetail = document.createElement('section');
          serviceDetail.id = 'service-detail';
          serviceDetail.className = 'page';
          document.body.appendChild(serviceDetail);
        }

        serviceDetail.innerHTML = `
          <div class="container">
            <h2>${service.title}</h2>
            <img src="${service.image}" alt="${service.title}" style="max-width:100%; margin:20px 0;">
            <p>${service.description}</p>
            <button onclick="showPage('services')">Back to Services</button>
          </div>
        `;
        showPage('service-detail');
      }
    });
}

// Make global so buttons can call it
window.openServicePage = openServicePage;

// ================= DOM CONTENT LOADED =================
document.addEventListener('DOMContentLoaded', () => {

  // ===== SPA NAVIGATION =====
  const navLinks = document.querySelectorAll('[data-page]');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  const hashPage = window.location.hash.replace('#','');
  if (hashPage && document.getElementById(hashPage)) showPage(hashPage);
  else showPage('home');

  // ===== HERO SLIDESHOW =====
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.querySelector('.dots');
  let currentSlide = 0;
  let slideInterval;

  if (slides.length && dotsContainer) {
    slides.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = 'dot' + (index === 0 ? ' active' : '');
      dot.addEventListener('click', () => { showSlide(index); resetAutoSlide(); });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      currentSlide = index;
    }

    function nextSlide() { showSlide((currentSlide + 1) % slides.length); }
    function startAutoSlide() { slideInterval = setInterval(nextSlide, 5000); }
    function resetAutoSlide() { clearInterval(slideInterval); startAutoSlide(); }
    startAutoSlide();
  }

  // ===== BOOKING FORM =====
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      fetch(bookingForm.action, { method: bookingForm.method, body: new FormData(bookingForm), headers:{'Accept':'application/json'} })
        .then(res => res.ok ? (alert('Booking submitted!'), bookingForm.reset()) : alert('Booking failed!'))
        .catch(()=>alert('Network error!'));
    });
  }

  // ===== COPY TO CLIPBOARD =====
  window.copyText = text => navigator.clipboard.writeText(text).then(()=>alert('Copied: '+text)).catch(()=>alert('Copy failed'));

  // ===== LOAD SERVICES =====
  const serviceContainer = document.querySelector('.service-grid');
  if(serviceContainer){
    fetch('services.json')
      .then(res => res.json())
      .then(data => {
        data.forEach(service => {
          const card = document.createElement('div');
          card.className = 'service-card';
          card.innerHTML = `
            <i class="${service.icon}" style="font-size:40px;color:#1E3A5F;margin-bottom:10px;"></i>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <button class="service-btn" data-id="${service.id}">Read More</button>
          `;
          serviceContainer.appendChild(card);
        });

        // Add click event for "Read More" buttons
        document.querySelectorAll('.service-btn').forEach(btn => {
          btn.addEventListener('click', () => openServicePage(btn.dataset.id));
        });
      })
      .catch(err => console.error("Error loading services.json:", err));
  }

  // ===== CHATBOT =====
  const toggle = document.getElementById('chatbot-toggle');
  const container = document.getElementById('chatbot-container');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');
  const options = document.querySelectorAll('#chatbot-options button');

  toggle.addEventListener('click', () => container.style.display = 'flex');
  closeBtn.addEventListener('click', () => container.style.display = 'none');

  function addMessage(text, className, html = false) {
    const div = document.createElement('div');
    div.className = className;
    if (html) div.innerHTML = text;
    else div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

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

  function processMessage(text) {
    if (text.includes('service') || text.includes('services')) {
      fetch('services.json')
        .then(res => res.json())
        .then(data => {
          if (!data.length) return addMessage('No services available.', 'bot-message');
          addMessage('Here are our main services:', 'bot-message');

          data.forEach(service => {
            const content = `
              <div style="border:1px solid #ccc; padding:8px; margin:5px 0; border-radius:8px;">
                <img src="${service.image}" alt="${service.title}" style="width:80px; height:80px; object-fit:contain; float:left; margin-right:10px;">
                <strong>${service.title}</strong><br>
                <small>${service.description}</small><br>
                <button class="service-chat-btn" data-id="${service.id}">Read More</button>
                <button class="book-service-btn" data-title="${service.title}">Book Now</button>
                <div style="clear:both;"></div>
              </div>
            `;
            addMessage(content, 'bot-message', true);
          });

          document.querySelectorAll('.service-chat-btn').forEach(btn => {
            btn.addEventListener('click', () => openServicePage(btn.dataset.id));
          });

          document.querySelectorAll('.book-service-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              showPage('booking');
              if (bookingForm) {
                const msgField = bookingForm.querySelector('textarea[name="message"]');
                if (msgField) msgField.value = `Booking request for: ${btn.dataset.title}`;
              }
              addMessage(`Booking form opened for: ${btn.dataset.title}`, 'bot-message');
            });
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

  // ===== Show page from URL hash =====
  if (window.location.hash) {
    const hash = window.location.hash.replace('#', '');
    showPage(hash);
  }

});
