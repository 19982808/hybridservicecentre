// ================= SPA NAVIGATION =================
const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".main-nav a");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const pageId = link.dataset.page;
    pages.forEach(page => {
      page.style.display = page.id === pageId ? "block" : "none";
      page.classList.toggle("active", page.id === pageId);
    });
    if(pageId === "our-services") loadServices();
  });
});

// ================= HERO SLIDESHOW =================
let slideIndex = 0;
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".dots");

function showSlides() {
  slides.forEach(s => s.classList.remove("active"));
  dotsContainer.innerHTML = "";
  slides[slideIndex].classList.add("active");

  for(let i=0; i<slides.length; i++){
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if(i === slideIndex) dot.classList.add("active");
    dot.addEventListener("click", () => { slideIndex = i; showSlides(); });
    dotsContainer.appendChild(dot);
  }

  slideIndex = (slideIndex + 1) % slides.length;
  setTimeout(showSlides, 5000);
}

showSlides();

// ================= LOAD SERVICES =================
async function loadServices() {
  const serviceGrid = document.querySelector(".service-grid");
  serviceGrid.innerHTML = "";
  const res = await fetch("services.json");
  const services = await res.json();

  services.forEach(service => {
    const card = document.createElement("div");
    card.classList.add("service-card");
    card.innerHTML = `
      <img src="${service.image}" alt="${service.title}">
      <h3>${service.title}</h3>
      <p>${service.shortDescription}</p>
      <button class="read-more" data-id="${service.id}">Read More</button>
    `;
    serviceGrid.appendChild(card);
  });

  document.querySelectorAll(".read-more").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = btn.dataset.id;
      const service = services.find(s => s.id === id);
      showServiceDetail(service);
    });
  });
}

// ================= SERVICE DETAIL =================
function showServiceDetail(service) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  const detailPage = document.getElementById("service-detail");
  detailPage.style.display = "block";
  const content = detailPage.querySelector(".service-detail-content");
  content.innerHTML = `
    <h2>${service.title}</h2>
    <img src="${service.image}" alt="${service.title}">
    <p>${service.fullDescription}</p>
    <h4>Includes:</h4>
    <ul>${service.includes.map(i => `<li>${i}</li>`).join("")}</ul>
  `;
  document.getElementById("back-to-services").onclick = () => {
    detailPage.style.display = "none";
    document.getElementById("our-services").style.display = "block";
  };
}

// Initialize the chatbot
createChatbot();
