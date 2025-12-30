document.addEventListener('DOMContentLoaded', () => {

  /* SPA Navigation */
  const navLinks = document.querySelectorAll('[data-page]');
  const pages = document.querySelectorAll('.page');

  // Make showPage global
  window.showPage = function(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
    window.scrollTo(0,0);
    history.replaceState(null, '', `#${pageId}`);
  };

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) showPage(hash);
  else showPage('home');

  /* ================= CHATBOT ================= */
  const toggle = document.getElementById('chatbot-toggle');
  const container = document.getElementById('chatbot-container');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');
  const options = document.querySelectorAll('#chatbot-options button');
  const bookingForm = document.getElementById('bookingForm');
  let servicesCache = [];

  toggle.addEventListener('click', () => container.style.display = 'flex');
  closeBtn.addEventListener('click', () => container.style.display = 'none');

  function addMessage(text, className, html=false) {
    const div = document.createElement('div');
    div.className = className;
    if(html) div.innerHTML = text;
    else div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function sendMessage() {
    const text = input.value.trim();
    if(!text) return;
    addMessage(text,'user-message');
    input.value='';
    setTimeout(()=>processMessage(text.toLowerCase()),400);
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', e => { if(e.key==='Enter') sendMessage(); });

  options.forEach(btn => {
    btn.addEventListener('click', () => {
      if(btn.id==='whatsapp-chat') window.open('https://wa.me/254712328599','_blank');
      else { input.value = btn.dataset.option; sendMessage(); }
    });
  });

  // Load services once
  fetch('services.json')
    .then(res=>res.json())
    .then(data=>servicesCache=data)
    .catch(err=>console.error('Failed to load services:',err));

  function processMessage(text){
    if(text.includes('service')){
      if(!servicesCache.length) return addMessage('No services available.','bot-message');
      addMessage('Here are our services:','bot-message');

      servicesCache.forEach(service=>{
        const content=`
          <div style="border:1px solid #ccc; padding:8px; margin:6px 0; border-radius:8px;">
            <img src="${service.image}" style="width:70px;height:70px;float:left;margin-right:10px;">
            <strong>${service.title}</strong><br>
            <small>${service.shortDescription}</small><br>
            <button class="chat-read-more" data-id="${service.id}">Read More</button>
            <button class="chat-book-now" data-title="${service.title}">Book Now</button>
            <div style="clear:both"></div>
          </div>
        `;
        addMessage(content,'bot-message',true);
      });

    } else if(text.includes('book')){
      showPage('booking');
      addMessage('Booking form opened.','bot-message');
    } else if(text.includes('location')){
      showPage('contact');
      addMessage('Our location: Naivasha road, Dagoretti Corner next to Shell petrol station.','bot-message');
    } else if(text.includes('contact')){
      showPage('contact');
      addMessage('Call 0712328599 or email info@hybridservice.com.','bot-message');
    } else addMessage('Try typing: services, book, location, or contact.','bot-message');
  }

  // Event delegation for dynamically created buttons
  messages.addEventListener('click', e => {

    // READ MORE
    if(e.target.classList.contains('chat-read-more')){
      const id = e.target.dataset.id;
      const service = servicesCache.find(s=>s.id===id);
      if(!service) return;
      const detail = document.getElementById('service-detail');
      if(!detail) return;

      detail.innerHTML = `
        <div class="container">
          <h2>${service.title}</h2>
          <img src="${service.image}" style="max-width:100%; margin:20px 0;">
          <p>${service.fullDescription}</p>
          <h4>Includes:</h4>
          <ul>${service.includes.map(item=>`<li>${item}</li>`).join('')}</ul>
          <button class="back-to-services-btn">Back to Our Services</button>
        </div>
      `;
      showPage('service-detail');
    }

    // BOOK NOW
    if(e.target.classList.contains('chat-book-now')){
      showPage('booking');
      if(bookingForm){
        const msg = bookingForm.querySelector('textarea[name="message"]');
        if(msg) msg.value = `Booking request for: ${e.target.dataset.title}`;
      }
      addMessage(`Booking form opened for ${e.target.dataset.title}`,'bot-message');
    }

    // BACK TO OUR SERVICES
    if(e.target.classList.contains('back-to-services-btn')){
      showPage('our-services');
    }
  });

});
