// AIAGENT SCRIPT

let API_BASE = null;
const BACKEND_PORTS = [8000, 8001, 8002, 8003, 8004];
const BACKEND_HOST = 'http://127.0.0.1';

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const themeBtn = document.getElementById('themeBtnFooter');
const aiagentAlert = document.getElementById('aiagentAlert');
const body = document.body;

// Theme management
const THEME_KEY = 'aiagent-theme';
const LIGHT_MODE = 'light-mode';

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === LIGHT_MODE) {
        body.classList.add(LIGHT_MODE);
        updateThemeIcon(true);
    } else {
        body.classList.remove(LIGHT_MODE);
        updateThemeIcon(false);
    }
}

function updateThemeIcon(isLight) {
    if (isLight) {
        themeBtn.textContent = 'Modo Oscuro';
    } else {
        themeBtn.textContent = 'Modo Claro';
    }
}

function toggleTheme() {
    body.classList.toggle(LIGHT_MODE);
    const isLight = body.classList.contains(LIGHT_MODE);
    localStorage.setItem(THEME_KEY, isLight ? LIGHT_MODE : 'dark-mode');
    updateThemeIcon(isLight);
}

function showAlert(message, type = 'info') {
    if (!aiagentAlert) return;
    aiagentAlert.textContent = message;
    aiagentAlert.className = `aiagent-alert ${type}`;
    aiagentAlert.classList.remove('d-none');
}

function hideAlert() {
    if (!aiagentAlert) return;
    aiagentAlert.className = 'aiagent-alert d-none';
    aiagentAlert.textContent = '';
}

function initializeConnectionWarning() {
    if (window.location.protocol === 'file:') {
        showAlert(
            'Este chat debe abrirse desde un servidor local (HTTP). No uses el archivo directamente. ' +
            'Ejecuta un servidor local en la carpeta del frontend para conectar con el backend de IA.',
            'error'
        );
    } else {
        hideAlert();
    }
}

async function discoverApiBase() {
    if (API_BASE) return API_BASE;

    for (const port of BACKEND_PORTS) {
        try {
            const response = await fetch(`${BACKEND_HOST}:${port}/`, {
                method: 'GET',
                cache: 'no-store'
            });
            if (response.ok) {
                API_BASE = `${BACKEND_HOST}:${port}`;
                showAlert(`Conectado al backend de IA en ${API_BASE}`, 'info');
                return API_BASE;
            }
        } catch (error) {
            continue;
        }
    }

    showAlert(
        'No se encontró el backend de IA en los puertos 8000-8004. Inicia el backend con "python app.py --web" y abre esta página desde un servidor local.',
        'error'
    );
    return null;
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

themeBtn.addEventListener('click', toggleTheme);

// Send Message Function
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) return;

    // Add user message to chat
    addMessageToChat(message, 'user');
    messageInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    const apiBase = await discoverApiBase();
    if (!apiBase) {
        hideTypingIndicator();
        addMessageToChat('No se encontró el backend de IA. Inicia el servidor con "python app.py --web" y vuelve a intentarlo.', 'ai');
        return;
    }

    try {
        // Call THANIA IA API
        const response = await fetch(`${apiBase}/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add AI response to chat
        addMessageToChat(data.response, 'ai');
        
    } catch (error) {
        console.error('Error calling THANIA IA API:', error);
        hideTypingIndicator();
        
        const errorMessage =
            'No se pudo conectar al servidor de IA. Asegúrate de ejecutar el backend con "python app.py --web" y de abrir esta página desde un servidor HTTP local.';
        addMessageToChat(errorMessage, 'ai');
        showAlert('Error de conexión con el backend de IA. Revisa que el servidor esté corriendo.', 'error');
    }
}

// Add Message to Chat
function addMessageToChat(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;

    if (sender === 'ai') {
        messageDiv.innerHTML = `
            <div class="message-icon">
                <img src="assets/Images/thania-avatar.png" alt="Thania" class="ai-avatar">
            </div>
            <div class="message-content">
                <p class="message-sender">Thania</p>
                <div class="message-bubble ai-bubble">
                    ${escapeHtml(message)}
                </div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p class="message-sender">Tú</p>
                <div class="message-bubble user-bubble">
                    ${escapeHtml(message)}
                </div>
            </div>
            <div class="message-icon">
                <i class="bi bi-person-circle"></i>
            </div>
        `;
    }

    chatMessages.appendChild(messageDiv);

    // Auto scroll to bottom
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// Typing Indicator Functions
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-icon">
            <img src="assets/Images/thania-avatar.png" alt="Thania" class="ai-avatar">
        </div>
        <div class="message-content">
            <p class="message-sender">Thania</p>
            <div class="message-bubble ai-bubble">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingDiv = document.getElementById('typingIndicator');
    if (typingDiv) {
        typingDiv.remove();
    }
}

// Generate AI Response (Mock for now)
function generateAIResponse(userMessage) {
    const responses = {
        'consulta': 'He encontrado 2 consultas pendientes en tu cuenta. ¿Deseas que te muestre más detalles?',
        'ticket': 'Tienes 1 ticket activo. Puedo mostarte más información si lo deseas.',
        'estado': 'Tu estado de cuenta está disponible. Tu cuenta está en buen estado.',
        'ayuda': 'Puedo ayudarte con: consultas de tickets, estados de cuenta, información de servicios y más. ¿Qué necesitas?',
        'hola': '¡Hola! ¿Cómo puedo asistirte hoy?'
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const [keyword, response] of Object.entries(responses)) {
        if (lowerMessage.includes(keyword)) {
            return response;
        }
    }

    return 'Entendido. Por favor, sé más específico sobre lo que necesitas. Puedo ayudarte con consultas, tickets y estados de cuenta.';
}

// Escape HTML special characters
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('✓ AI Agent inicializado correctamente');
    initializeTheme();
    initializeConnectionWarning();
    messageInput.focus();
});
