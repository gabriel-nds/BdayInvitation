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
    particle.position.y = (Math.random() - 0.5) * 5;
    particle.position.z = (Math.random() - 0.5) * 5;
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

// Flutuando a imagem de fundo (avatar)
const floatingAvatar = document.getElementById('floatingAvatar');
let t = 0;
function animateFloatingAvatar() {
    // Movimento horizontal e vertical suave
    const amplitudeX = window.innerWidth * 0.4;
    const amplitudeY = window.innerHeight * 0.2;
    const centerX = window.innerWidth / 2 - (floatingAvatar.offsetWidth / 2);
    const centerY = window.innerHeight / 2 - (floatingAvatar.offsetHeight / 2);
    const x = centerX + Math.sin(t) * amplitudeX;
    const y = centerY + Math.cos(t * 0.7) * amplitudeY;
    floatingAvatar.style.transform = `translate(${x}px, ${y}px)`;
    t += 0.005;
    requestAnimationFrame(animateFloatingAvatar);
}
if (floatingAvatar) animateFloatingAvatar(); 