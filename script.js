document.addEventListener('DOMContentLoaded', () => {

  /* ================= SPA NAVIGATION ================= */
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('[data-page]');

  function showPage(pageId) {
    pages.forEach(p => p.classList.remove('active'));
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

  // Load page from hash
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) showPage(hash);
  else showPage('home');

  /* ================= HERO SLIDESHOW ================= */
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.querySelector('.dots');
  let currentSlide = 0;

  if (slides.length && dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => showSlide(i);
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function showSlide(index) {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      currentSlide = index;
    }

    setInterval(() => showSlide((currentSlide + 1) % slides.length), 5000);
  }

  /* ================= BOOKING FORM ================= */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      fetch(bookingForm.action, {
        method: bookingForm.method,
        body: new FormData(bookingForm),
        headers: { 'Accept': 'application/json' }
      })
        .then(res => res.ok ? (alert('Booking submitted!'), bookingForm.reset()) : alert('Booking failed'))
        .catch(() => alert('Network error'));
    });
  }

  /* ================= LOAD SERVICES ================= */
  const serviceGrid = document.querySelector('.service-grid');
  const serviceDetail = document.getElementById('service-detail');

  fetch('services.json')
    .then(res => res.json())
    .then(services => {
      if (!serviceGrid) return;

      serviceGrid.innerHTML = '';

      services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
          <img src="${service.image}" alt="${service.title}">
          <h3>${service.title}</h3>
          <p>${service.description}</p>
          <button class="read-more-btn">Read More</button>
          <button class="book-now-btn">Book Now</button>
        `;

        // Read More
        card.querySelector('.read-more-btn').onclick = () => openService(service);

        // Book Now
        card.querySelector('.book-now-btn').onclick = () => {
          showPage('booking');
          const msg = bookingForm?.querySelector('textarea[name="message"]');
          if (msg) msg.value = `Booking request for: ${service.title}`;
        };

        serviceGrid.appendChild(card);
      });
    });

  /* ================= SERVICE DETAIL ================= */
  function openService(service) {
    if (!serviceDetail) return;

    serviceDetail.innerHTML = `
      <h2>${service.title}</h2>
      <img src="${service.image}" alt="${service.title}">
      <p>${service.description}</p>
      <button id="back-services">← Back to Services</button>
    `;

    showPage('service-detail');

    document.getElementById('back-services').onclick = () => showPage('services');
  }

});
