/***********************
 GLOBAL STATE
************************/
let SERVICES = [];

/***********************
 PAGE NAVIGATION
************************/
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');
  window.scrollTo(0, 0);
  history.replaceState(null, '', `#${pageId}`);
}

/***********************
 LOAD SERVICES (ONCE)
************************/
function loadServices() {
  return fetch('services.json')
    .then(res => res.json())
    .then(data => {
      SERVICES = data;
      renderServices();
      return data;
    })
    .catch(err => console.error('Services load error:', err));
}

/***********************
 RENDER SERVICES SECTION
************************/
function renderServices() {
  const grid = document.querySelector('.service-grid');
  if (!grid) return;

  grid.innerHTML = SERVICES.map(service => `
    <div class="service-card" onclick="openServicePage('${service.id}')">
      <img src="${service.image}" alt="${service.title}">
      <h3>${service.title}</h3>
      <p>${service.shortDescription}</p>
    </div>
  `).join('');
}

/***********************
 SERVICE DETAILS PAGE
************************/
function openServicePage(id) {
  const service = SERVICES.find(s => s.id === id);
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
      <img src="${service.image}" style="max-width:100%;margin:20px 0;border-radius:10px;">
      <p>${service.fullDescription}</p>
      <ul>
        ${service.includes.map(i => `<li>${i}</li>`).join('')}
      </ul>
      <button onclick="showPage('services')">← Back to Services</button>
    </div>
  `;

  showPage('service-detail');
}

/***********************
 CHATBOT
************************/
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('chatbot-toggle');
  const container = document.getElementById('chatbot-container');
  const close = document.getElementById('chatbot-close');
  const input = document.getElementById('chatbot-input');
  const send = document.getElementById('chatbot-send');
  const messages = document.getElementById('chatbot-messages');

  toggle.onclick = () => container.style.display = 'flex';
  close.onclick = () => container.style.display = 'none';

  function addMessage(text, cls, html = false) {
    const div = document.createElement('div');
    div.className = cls;
    html ? div.innerHTML = text : div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function handleMessage(msg) {
    msg = msg.toLowerCase();

    if (msg.includes('service')) {
      SERVICES.forEach(service => {
        addMessage(`
          <strong>${service.title}</strong><br>
          ${service.shortDescription}<br>
          <img src="${service.image}"
               style="width:100%;margin-top:6px;border-radius:8px;cursor:pointer"
               onclick="openServicePage('${service.id}')">
        `, 'bot-message', true);
      });
    } else if (msg.includes('book')) {
      showPage('booking');
      addMessage('Booking page opened.', 'bot-message');
    } else if (msg.includes('location')) {
      showPage('location');
      addMessage('Here is our location.', 'bot-message');
    } else {
      addMessage('Type "services", "book", or "location".', 'bot-message');
    }
  }

  send.onclick = () => {
    if (!input.value.trim()) return;
    addMessage(input.value, 'user-message');
    handleMessage(input.value);
    input.value = '';
  };

  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') send.click();
  });

  // LOAD EVERYTHING
  loadServices();
  showPage('home');
});
