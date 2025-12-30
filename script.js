// ================= NAVIGATION =================
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.main-nav ul');
menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('show');
});

const pages = document.querySelectorAll('.page');
document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.dataset.page;
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(target).classList.add('active');
    window.scrollTo(0, 0);
  });
});

// ================= HERO SLIDES =================
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');
let currentSlide = 0;

// Generate dots
slides.forEach((_, i) => {
  const dot = document.createElement('span');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => showSlide(i));
  dotsContainer.appendChild(dot);
});
const dots = dotsContainer.querySelectorAll('span');

function showSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = n;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}
function nextSlide() {
  let next = (currentSlide + 1) % slides.length;
  showSlide(next);
}
setInterval(nextSlide, 5000);

// ================= SERVICES =================
fetch('services.json')
  .then(res => res.json())
  .then(data => {
    const grid = document.querySelector('.service-grid');
    data.forEach(service => {
      const card = document.createElement('div');
      card.classList.add('service-card');
      card.innerHTML = `
        <img src="${service.image}" alt="${service.title}">
        <h3>${service.title}</h3>
        <p>${service.shortDescription}</p>
      `;
      card.addEventListener('click', () => showServiceDetail(service));
      grid.appendChild(card);
    });
  });

function showServiceDetail(service) {
  pages.forEach(p => p.classList.remove('active'));
  document.getElementById('service-detail').classList.add('active');
  const container = document.querySelector('.service-detail-content');
  container.innerHTML = `
    <h2>${service.title}</h2>
    <img src="${service.image}" alt="${service.title}" style="max-width:400px;width:100%;margin-bottom:1rem;">
    <p>${service.fullDescription}</p>
    <h3>Includes:</h3>
    <ul>${service.includes.map(item => `<li>${item}</li>`).join('')}</ul>
    <button onclick="document.getElementById('booking').scrollIntoView({behavior:'smooth'});">Book Service</button>
  `;
}
