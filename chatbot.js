const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');
const whatsappChat = document.getElementById('whatsapp-chat');

chatbotToggle.addEventListener('click', () => {
  chatbotContainer.style.display = 'flex';
});

chatbotClose.addEventListener('click', () => {
  chatbotContainer.style.display = 'none';
});

function addMessage(msg, isUser = false) {
  const div = document.createElement('div');
  div.textContent = msg;
  div.style.marginBottom = '0.5rem';
  div.style.textAlign = isUser ? 'right' : 'left';
  chatbotMessages.appendChild(div);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

chatbotSend.addEventListener('click', () => {
  const msg = chatbotInput.value.trim();
  if (!msg) return;
  addMessage(msg, true);
  chatbotInput.value = '';
  respond(msg.toLowerCase());
});

chatbotInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') chatbotSend.click();
});

function respond(msg) {
  if (msg.includes('service') || msg.includes('services')) {
    addMessage('You can view our services here: Our Services section');
  } else if (msg.includes('book')) {
    addMessage('You can book a service using the Book section.');
  } else if (msg.includes('location')) {
    addMessage('We are located at Naivasha Road, Dagoretti Corner next to Shell petrol station.');
  } else {
    addMessage("I'm here to help! You can ask about our services, booking, or location.");
  }
}

whatsappChat.addEventListener('click', () => {
  window.open('https://wa.me/254712328599', '_blank');
});
