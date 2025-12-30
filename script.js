/* ================= GLOBAL SERVICES DATA ================= */
const SERVICES = [
  {
    id: "engine",
    title: "Hybrid Engine Service",
    shortDescription: "Specialized servicing for hybrid engines.",
    fullDescription: "Inspection and servicing of Atkinson-cycle hybrid engines, fuel systems, cooling, and performance optimization.",
    image: "services/engine.png"
  },
  {
    id: "software",
    title: "Software Updates",
    shortDescription: "Hybrid ECU software updates.",
    fullDescription: "Firmware updates, calibration, error fixes, and performance tuning for hybrid control units.",
    image: "services/software.png"
  },
  {
    id: "maintenance",
    title: "General Maintenance",
    shortDescription: "Routine hybrid vehicle maintenance.",
    fullDescription: "Cooling systems, AC service, suspension checks, alignment, and preventive maintenance.",
    image: "services/maintenance.png"
  },
  {
    id: "brake",
    title: "Brake System Service",
    shortDescription: "Regenerative brake servicing.",
    fullDescription: "Inspection of brake pads, discs, actuators, and regenerative braking systems.",
    image: "services/brake.png"
  },
  {
    id: "battery",
    title: "Hybrid Battery Service",
    shortDescription: "High-voltage battery diagnostics & repair.",
    fullDescription: "Battery health checks, cell balancing, cooling system inspection, and repair.",
    image: "services/battery.png"
  },
  {
    id: "diagnostics",
    title: "Hybrid Diagnostics",
    shortDescription: "Advanced hybrid system diagnostics.",
    fullDescription: "Full ECU scanning, fault code analysis, live data monitoring, and system health reports.",
    image: "services/diagnostics.png"
  }
];

/* ================= PAGE NAVIGATION ================= */
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = document.getElementById(pageId);
  if (page) page.classList.add("active");

  document.querySelectorAll(".main-nav a").forEach(a => a.classList.remove("active"));
  document.querySelector(`.main-nav a[data-page="${pageId}"]`)?.classList.add("active");
}

document.querySelectorAll("[data-page]").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

/* ================= SERVICES SECTION ================= */
const serviceGrid = document.querySelector(".service-grid");

if (serviceGrid) {
  serviceGrid.innerHTML = SERVICES.map(service => `
    <div class="service-card">
      <img src="${service.image}" alt="${service.title}">
      <h3>${service.title}</h3>
      <p>${service.shortDescription}</p>
    </div>
  `).join("");
}

/* ================= HERO SLIDER ================= */
let slides = document.querySelectorAll(".slide");
let dotsContainer = document.querySelector(".dots");
let currentSlide = 0;

if (slides.length && dotsContainer) {
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = i === 0 ? "dot active" : "dot";
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    slides[currentSlide].classList.remove("active");
    dotsContainer.children[currentSlide].classList.remove("active");
    currentSlide = index;
    slides[currentSlide].classList.add("active");
    dotsContainer.children[currentSlide].classList.add("active");
  }

  setInterval(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, 5000);
}

/* ================= CHATBOT ================= */
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotContainer = document.getElementById("chatbot-container");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotMessages = document.getElementById("chatbot-messages");

chatbotToggle.onclick = () => chatbotContainer.classList.add("open");
chatbotClose.onclick = () => chatbotContainer.classList.remove("open");

function botMessage(html) {
  chatbotMessages.innerHTML += `<div class="bot-message">${html}</div>`;
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

document.querySelectorAll("#chatbot-options button").forEach(btn => {
  btn.onclick = () => {
    const option = btn.dataset.option;

    if (option === "services") {
      SERVICES.forEach(service => {
        botMessage(`
          <strong>${service.title}</strong><br>
          ${service.shortDescription}<br>
          <img src="${service.image}" style="width:100%;border-radius:8px;margin-top:6px">
        `);
      });
    }

    if (option === "book") {
      botMessage("To book a service, please visit the Book section or WhatsApp us.");
      showPage("booking");
    }

    if (option === "location") {
      botMessage("We are located in Nairobi, Kenya. See the Location section for directions.");
      showPage("location");
    }
  };
});

document.getElementById("whatsapp-chat").onclick = () => {
  window.open("https://wa.me/254712328599", "_blank");
};
