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

// Form handling
const form = document.getElementById('rsvpForm');
const confirmation = document.getElementById('confirmation');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value
    };

    try {
        // Here you would typically send the data to your email
        // For now, we'll just simulate a successful submission
        console.log('RSVP Data:', formData);
        
        // Show confirmation message
        form.style.display = 'none';
        confirmation.classList.remove('hidden');
        
        // You can add your email sending logic here
        // For example, using a service like EmailJS or your own backend
        // For now, we'll just log the data that would be sent to gndsantos@gmail.com
        
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Ops! Algo deu errado. Tente novamente!');
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