// Initialize Three.js scene for background pixel art
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('pixelCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create pixel art particles
const particles = [];
const particleCount = 50;
const particleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

for (let i = 0; i < particleCount; i++) {
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.x = (Math.random() - 0.5) * 5;
    particle.position.y = (Math.random() - 0.4) * 5;
    particle.position.z = (Math.random() - 0.3) * 5;
    particle.rotation.x = Math.random() * Math.PI;
    particle.rotation.y = Math.random() * Math.PI;
    scene.add(particle);
    particles.push(particle);
}

camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    particles.forEach(particle => {
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
        particle.position.y += Math.sin(Date.now() * 0.001 + particle.position.x) * 0.01;
    });

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    t = 0;
});

// Validação de email mais rigorosa
function isValidEmail(email) {
    // Regex mais rigoroso para emails reais
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    // Lista de domínios temporários/descartáveis comuns para bloquear
    const disposableEmailDomains = [
        '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
        'yopmail.com', 'temp-mail.org', 'throwaway.email', 'getnada.com'
    ];
    
    if (!emailRegex.test(email)) {
        return false;
    }
    
    const domain = email.split('@')[1].toLowerCase();
    if (disposableEmailDomains.includes(domain)) {
        return false;
    }
    
    return true;
}

// Função para enviar dados para Google Sheets
async function sendToGoogleSheets(name, email) {
    // IMPORTANTE: Substitua YOUR_SCRIPT_ID pelo ID do seu Google Apps Script
    // Você vai obter este ID depois de criar o script no Google Apps Script
    const WEBHOOK_URL = 'https://script.google.com/macros/s/https://script.google.com/macros/s/AKfycbxH685tWFsAeZXUg6mXaR3pP7mWS0T9FJtIE4xnk_8DOl48oTqE0geC8nQTUehfFXWFMw/exec/exec';
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            if (result.message === 'Este email já foi cadastrado!') {
                throw new Error('DUPLICATE_EMAIL');
            }
            throw new Error(result.message || 'Erro desconhecido');
        }
        
        return result;
    } catch (error) {
        console.error('Erro ao enviar para Google Sheets:', error);
        throw error;
    }
}

// Form handling atualizado
const form = document.getElementById('rsvpForm');
const confirmation = document.getElementById('confirmation');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    
    // Validações
    if (!name || name.length < 2) {
        alert('Por favor, digite um nome válido (mínimo 2 caracteres).');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Por favor, digite um email válido e real. Emails temporários não são aceitos.');
        return;
    }
    
    // Mostrar loading
    const submitButton = form.querySelector('.pixel-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    try {
        // Enviar para Google Sheets
        await sendToGoogleSheets(name, email);
        
        // Mostrar confirmação
        form.style.display = 'none';
        confirmation.classList.remove('hidden');
        
        console.log('RSVP enviado com sucesso:', { name, email });
        
    } catch (error) {
        console.error('Erro ao enviar RSVP:', error);
        
        if (error.message === 'DUPLICATE_EMAIL') {
            alert('Este email já foi cadastrado! Se você já confirmou presença, não precisa fazer novamente.');
        } else {
            alert('Ops! Algo deu errado ao enviar sua confirmação. Verifique sua conexão e tente novamente.');
        }
        
        // Restaurar botão
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Add some fun pixel art animations to the button
const button = document.querySelector('.pixel-button');
button.addEventListener('mouseover', () => {
    button.style.transform = 'scale(1.05) translateY(-2px)';
});

button.addEventListener('mouseout', () => {
    button.style.transform = 'scale(1) translateY(0)';
});

// Add some fun to the input fields
const inputs = document.querySelectorAll('.pixel-input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
    });
});

// Função para embaralhar arrays (Fisher-Yates)
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Flutuando múltiplas figuras de fundo (avatares, chapéus, balões)
let floatingFigures = Array.from(document.querySelectorAll('.floating-figure'));
floatingFigures = shuffleArray(floatingFigures);

// Função utilitária para distribuir pontos em grid (espalhamento)
function generateGridPositions(count, xSpread, ySpread, xOffset, yOffset) {
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const positions = [];
    
    // Adiciona um offset aleatório pequeno para cada posição para evitar alinhamento perfeito
    for (let i = 0; i < count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const baseX = xOffset + (col / (cols - 1 || 1)) * xSpread;
        const baseY = yOffset + (row / (rows - 1 || 1)) * ySpread;
        
        // Adiciona variação aleatória para evitar posições idênticas
        const x = baseX + (Math.random() - 0.5) * 100;
        const y = baseY + (Math.random() - 0.5) * 100;
        
        positions.push({x, y});
    }
    return positions;
}

// Parâmetros para clusters verticais (mais abertos no Y)
const verticalCount = floatingFigures.length;
const verticalGrid = generateGridPositions(verticalCount, window.innerWidth * 0.8, window.innerHeight * 0.8, window.innerWidth * 0.1, window.innerHeight * 0.1);
const verticalParams = Array.from({length: verticalCount}).map((_, i) => ({
    amplitudeX: window.innerWidth * (0.25 + Math.random() * 0.35), // aumentado de 0.15-0.35 para 0.25-0.6
    amplitudeY: window.innerHeight * (0.4 + Math.random() * 0.5), // aumentado de 0.3-0.7 para 0.4-0.9
    speed: 0.003 + Math.random() * 0.005, // mantém igual
    phase: Math.random() * Math.PI * 2,
    phaseY: Math.random() * Math.PI * 2,
    baseX: verticalGrid[i].x,
    baseY: verticalGrid[i].y
}));

// Parâmetros para clusters horizontais (mais abertos no X)
const horizontalCount = Math.ceil(floatingFigures.length * 0.6);
const horizontalGrid = generateGridPositions(horizontalCount, window.innerWidth * 0.8, window.innerHeight * 0.8, window.innerWidth * 0.1, window.innerHeight * 0.1);
const horizontalParams = Array.from({length: horizontalCount}).map((_, i) => ({
    amplitudeX: window.innerWidth * (0.35 + Math.random() * 0.4), // aumentado de 0.25-0.55 para 0.35-0.75
    amplitudeY: window.innerHeight * (0.15 + Math.random() * 0.25), // aumentado de 0.1-0.25 para 0.15-0.4
    speed: 0.003 + Math.random() * 0.005, // mantém igual
    phase: Math.random() * Math.PI * 2,
    phaseY: Math.random() * Math.PI * 2,
    baseX: horizontalGrid[i].x,
    baseY: horizontalGrid[i].y
}));

// Junta todos os parâmetros
const allParams = [...verticalParams, ...horizontalParams];

// Reduzir o número de figuras duplicadas para evitar excesso
const allFigures = [
    ...floatingFigures,
    ...Array.from(floatingFigures).slice(0, Math.ceil(floatingFigures.length * 0.5)).map((f, i) => {
        const clone = f.cloneNode(true);
        clone.dataset.gridIndex = i + verticalCount;
        return clone;
    })
];

// Adiciona as figuras extras ao DOM
const floatingBg = document.querySelector('.floating-bg');
allFigures.slice(floatingFigures.length).forEach(f => floatingBg.appendChild(f));

function animateFloatingFigures() {
    allFigures.forEach((fig, i) => {
        const p = allParams[i % allParams.length];
        const t = Date.now() * p.speed + p.phase;
        const x = p.baseX + Math.cos(t) * p.amplitudeX;
        const y = p.baseY + Math.sin(t + p.phaseY) * p.amplitudeY;
        fig.style.transform = `translate(${x}px, ${y}px)` + (fig.style.transform.includes('scaleX(-1)') ? ' scaleX(-1)' : '');
    });
    requestAnimationFrame(animateFloatingFigures);
}
if (allFigures.length) animateFloatingFigures(); 