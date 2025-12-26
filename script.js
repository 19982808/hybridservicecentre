document.addEventListener('DOMContentLoaded', () => {

  /* ================= SPA NAVIGATION + HASH SUPPORT ================= */
  const navLinks = document.querySelectorAll('[data-page]');
  const pages = document.querySelectorAll('.page');

  function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
    window.scrollTo(0, 0);
    history.replaceState(null, '', `#${pageId}`);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  /* Show hash page on load */
  const hashPage = window.location.hash.replace('#','');
  if (hashPage && document.getElementById(hashPage)) showPage(hashPage);
  else showPage('home');

  /* ================= HERO SLIDESHOW ================= */
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

  /* ================= BOOKING FORM ================= */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      fetch(bookingForm.action, { method: bookingForm.method, body: new FormData(bookingForm), headers:{'Accept':'application/json'} })
        .then(res => res.ok ? (alert('Booking submitted!'), bookingForm.reset()) : alert('Booking failed!'))
        .catch(()=>alert('Network error!'));
    });
  }

  /* ================= MPESA COPY ================= */
  window.copyText = text => navigator.clipboard.writeText(text).then(()=>alert('Copied: '+text)).catch(()=>alert('Copy failed'));

  /* ================= LOAD SERVICE CARDS ================= */
  const serviceContainer = document.querySelector('.service-grid');
  if(serviceContainer){
    fetch('services.json')
      .then(res => res.json())
      .then(data => {
        data.forEach(service => {
          const card = document.createElement('div');
          card.className = 'service-card';
          card.innerHTML = `
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <button class="service-btn" data-id="${service.id}">Read More</button>
          `;
          serviceContainer.appendChild(card);
        });

        /* Read more click -> open service page */
        document.querySelectorAll('.service-btn').forEach(btn => {
          btn.addEventListener('click', () => openServicePage(btn.dataset.id));
        });
      });
  }

  /* ================= SERVICE DETAIL PAGE ================= */
  const serviceDetail = document.getElementById('service-detail');
  function openServicePage(id){
    fetch('services.json')
      .then(res => res.json())
      .then(data => {
        const service = data.find(s=>s.id===id);
        if(service && serviceDetail){
          serviceDetail.innerHTML = `
            <h2>${service.title}</h2>
            <img src="${service.image}" alt="${service.title}" style="max-width:100%;margin:20px 0;">
            <p>${service.description}</p>
            <button onclick="showPage('services')">Back to Services</button>
          `;
          showPage('service-detail');
        }
      });
  }

});
// ================= LOAD SERVICE CARDS =================
document.addEventListener('DOMContentLoaded', () => {
  const serviceGrid = document.querySelector('.service-grid');
  const serviceDetail = document.getElementById('service-detail');
  const bookingForm = document.getElementById('bookingForm');

  // Load services
  fetch('services.json')
    .then(res => res.json())
    .then(data => {
      data.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
          <img src="${service.image}" alt="${service.title}" style="width:100px; height:100px; object-fit:contain;">
          <h3>${service.title}</h3>
          <p>${service.description}</p>
          <button class="read-more-btn" data-id="${service.id}">Read More</button>
          <button class="book-now-btn" data-title="${service.title}">Book Now</button>
        `;
        serviceGrid.appendChild(card);
      });

      // Read More click
      document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', () => openServicePage(btn.dataset.id, data));
      });

      // Book Now click
      document.querySelectorAll('.book-now-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          showPage('booking');
          if (bookingForm) {
            const msgField = bookingForm.querySelector('textarea[name="message"]');
            if (msgField) msgField.value = `Booking request for: ${btn.dataset.title}`;
          }
        });
      });
    });

  // Open service detail
  function openServicePage(id, services) {
    const service = services.find(s => s.id === id);
    if (service && serviceDetail) {
      serviceDetail.innerHTML = `
        <h2>${service.title}</h2>
        <img src="${service.image}" alt="${service.title}" style="max-width:100%;margin:20px 0;">
        <p>${service.description}</p>
        <button id="back-to-services">Back to Services</button>
      `;
      showPage('service-detail');

      document.getElementById('back-to-services').addEventListener('click', () => {
        showPage('services');
      });
    }
  }

  // SPA page switching
  function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
    window.scrollTo(0, 0);
    history.replaceState(null, '', `#${pageId}`);
  }
});
