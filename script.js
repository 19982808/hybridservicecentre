document.addEventListener('DOMContentLoaded', () => {

  /* ================= NAVBAR SCROLL EFFECT ================= */
  const header = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ================= SPA NAVIGATION ================= */
  const navLinks = document.querySelectorAll('[data-page]');
  const pages = document.querySelectorAll('.page');

  window.showPage = function (pageId) {
    pages.forEach(page => page.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
    window.scrollTo(0, 0);
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

  /* ================= HERO SLIDESHOW ================= */
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.querySelector('.dots');
  let currentSlide = 0;
  let slideInterval;

  if (slides.length && dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => showSlide(i));
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

    function startSlideshow() {
      slideInterval = setInterval(() => {
        showSlide((currentSlide + 1) % slides.length);
      }, 5000);
    }

    function stopSlideshow() {
      clearInterval(slideInterval);
    }

    startSlideshow();

    document.querySelector('.hero')?.addEventListener('mouseenter', stopSlideshow);
    document.querySelector('.hero')?.addEventListener('mouseleave', startSlideshow);
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
      .then(res => {
        if (res.ok) {
          alert('Booking submitted successfully!');
          bookingForm.reset();
        } else {
          alert('Booking failed. Try again.');
        }
      })
      .catch(() => alert('Network error. Please try again.'));
    });
  }

  /* ================= OUR SERVICES ================= */
  const serviceGrid = document.querySelector('.service-grid');
  const serviceDetail = document.getElementById('service-detail');
  let servicesCache = [];

  if (serviceGrid) {
    fetch('./services.json')   // 🔴 MUST be same folder as index.html
      .then(res => res.json())
      .then(data => {
        servicesCache = data;
        serviceGrid.innerHTML = '';

        data.forEach(service => {
          const card = document.createElement('div');
          card.className = 'service-card';
          card.innerHTML = `
            <img src="${service.image}" alt="${service.title}">
            <h3>${service.title}</h3>
            <p>${service.shortDescription}</p>
            <button class="read-more-btn" data-id="${service.id}">Read More</button>
          `;
          serviceGrid.appendChild(card);
        });

        document.querySelectorAll('.read-more-btn').forEach(btn => {
          btn.addEventListener('click', () => openServicePage(btn.dataset.id));
        });
      })
      .catch(err => console.error('Service loading error:', err));
  }

  function openServicePage(id) {
    const service = servicesCache.find(s => s.id === id);
    if (!service || !serviceDetail) return;

    serviceDetail.innerHTML = `
      <h2>${service.title}</h2>
      <img src="${service.image}" alt="${service.title}">
      <p>${service.fullDescription}</p>
      <h4>What This Service Includes:</h4>
      <ul>
        ${service.includes.map(item => `<li>${item}</li>`).join('')}
      </ul>
      <button id="back-to-services">← Back to Services</button>
    `;

    showPage('service-detail');

    document.getElementById('back-to-services')
      .addEventListener('click', () => showPage('our-services'));
  }

});
