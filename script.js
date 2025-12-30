/* ======================================================
   GLOBAL SERVICES CACHE (SINGLE SOURCE OF TRUTH)
====================================================== */
let SERVICES_CACHE = [];

function loadServices() {
  return fetch('services.json')
    .then(res => res.json())
    .then(data => {
      SERVICES_CACHE = data;
      return data;
    })
    .catch(err => {
      console.error('Failed to load services.json', err);
      SERVICES_CACHE = [];
      return [];
    });
}

/* ======================================================
   PAGE NAVIGATION
====================================================== */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');

  document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
  const nav = document.querySelector(`.main-nav a[data-page="${pageId}"]`);
  if (nav) nav.classList.add('active');
}

document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

/* ======================================================
   SERVICES GRID (OUR SERVICES SECTION)
====================================================== */
function renderServicesGrid() {
  const grid = document.querySelector('.service-grid');
  if (!grid) return;

  grid.innerHTML = SERVICES_CACHE.map(service => `
    <div class="service-card" onclick="openServicePage('${service.id}')">
      <img src="${service.image}" alt="${service.title}">
      <h3>${service.title}</h3>
      <p>${service.shortDescription}</p>
    </div>
  `).join('');
}

/* ======================================================
   SINGLE SERVICE DETAIL PAGE
====================================================== */
function openServicePage(id) {
  const service = SERVICES_CACHE.find(s => s.id === id);
  if (!service) return;

  let detail = document.getElementById('service-detail');

  if (!detail) {
    detail = document.createElement('section');
    detail.id = 'service-detail';
    detail.className = 'page';
    document.body.appendChild(detail);
  }

  detail.innerHTML = `
    <div class="container">
      <h2>${service.title}</h2>
      <img src="${service.image}" style="max-width:100%;border-radius:10px;margin:20px 0;">
      <p>${service.fullDescription}</p>
      <button onclick="showPage('services')">← Back to Services</button>
    </div>
  `;

  showPage('service-detail');
}

/* ======================================================
   HERO SLIDER
====================================================== */
let slides = document.querySelectorAll('.slide');
let dotsContainer = document.querySelector('.dots');
let currentSlide = 0;

if (slides.length && dotsContainer) {
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = i === 0 ? 'dot active' : 'dot';
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dotsContainer.children[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dotsContainer.children[currentSlide].classList.add('active');
  }

  setInterval(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, 5000);
}

/* ======================================================
   CHATBOT
====================================================== */
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');

if (chatbotToggle) {
  chatbotToggle.onclick = () => chatbotContainer.classList.add('open');
}
if (chatbotClose) {
  chatbotClose.onclick = () => chatbotContainer.classList.remove('open');
}

function botMessage(html) {
  chatbotMessages.innerHTML += `<div class="bot-message">${html}</div>`;
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

/* Chatbot option buttons */
document.querySelectorAll('#chatbot-options button').forEach(btn => {
  btn.onclick = () => {
    const option = btn.dataset.option;

    if (option === 'services') {
      SERVICES_CACHE.forEach(service => {
        botMessage(`
          <strong>${service.title}</strong><br>
          ${service.shortDescription}<br>
          <img src="${service.image}"
               style="width:100%;border-radius:8px;margin-top:6px;cursor:pointer"
               onclick="openServicePage('${service.id}')">
        `);
      });
    }

    if (option === 'book') {
      botMessage('To book a service, please visit the booking page or WhatsApp us.');
      showPage('booking');
    }

    if (option === 'location') {
      botMessage('We are located in Nairobi, Kenya. See the Location page for directions.');
      showPage('location');
    }
  };
});

/* WhatsApp shortcut */
const whatsappBtn = document.getElementById('whatsapp-chat');
if (whatsappBtn) {
  whatsappBtn.onclick = () => {
    window.open('https://wa.me/254712328599', '_blank');
  };
}

/* ======================================================
   INIT
====================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadServices().then(() => {
    renderServicesGrid();
  });
});
