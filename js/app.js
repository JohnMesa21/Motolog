// Inicialización del mapa
function initMap() {
    mapManager.initMap();

    // Agregar autocompletado para los campos de búsqueda
    const originInput = document.getElementById('route-origin');
    const destinationInput = document.getElementById('route-destination');

    const originAutocomplete = new google.maps.places.Autocomplete(originInput);
    const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);

    // Calcular ruta al hacer clic en el botón
    document.getElementById('calculate-route').addEventListener('click', async () => {
        const origin = originInput.value;
        const destination = destinationInput.value;

        if (!origin || !destination) {
            showNotification('Por favor, ingresa origen y destino', 'error');
            return;
        }

        try {
            await mapManager.calculateRoute(origin, destination);
            showNotification('Ruta calculada correctamente');
        } catch (error) {
            showNotification('Error al calcular la ruta', 'error');
        }
    });
}

// Gestión del formulario de la moto
document.addEventListener('DOMContentLoaded', () => {
    const bikeForm = document.getElementById('bike-form');
    
    if (bikeForm) {
        bikeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const bikeData = {
                brand: document.getElementById('brand').value,
                model: document.getElementById('model').value,
                year: document.getElementById('year').value,
                kilometers: document.getElementById('kilometers').value,
                plate: document.getElementById('plate').value,
                userId: currentUser.id
            };
            
            try {
                await db.addBike(bikeData);
                loadUserBikes();
                bikeForm.reset();
                showNotification('Moto registrada correctamente');
            } catch (error) {
                showNotification('Error al registrar la moto', 'error');
            }
        });
    }
});

// Cargar motos del usuario
async function loadUserBikes() {
    const bikesList = document.getElementById('bikes-list');
    if (!bikesList) return;

    try {
        const bikes = await db.getBikes(currentUser.id);
        bikesList.innerHTML = '';

        if (bikes.length === 0) {
            bikesList.innerHTML = '<p>No tienes motos registradas</p>';
            return;
        }

        bikes.forEach(bike => {
            const bikeCard = document.createElement('div');
            bikeCard.className = 'bike-card';
            bikeCard.innerHTML = `
                <h4>${bike.brand} ${bike.model}</h4>
                <div class="bike-info">
                    <p><strong>Año:</strong> ${bike.year}</p>
                    <p><strong>Kilometraje:</strong> ${bike.kilometers} km</p>
                    <p><strong>Matrícula:</strong> ${bike.plate}</p>
                </div>
            `;
            bikesList.appendChild(bikeCard);
        });

        // Verificar mantenimiento para cada moto
        checkMaintenanceAlerts();
    } catch (error) {
        console.error('Error al cargar las motos:', error);
    }
}

// Verificar alertas de mantenimiento
async function checkMaintenanceAlerts() {
    const alertsContainer = document.getElementById('maintenance-alerts');
    if (!alertsContainer) return;

    try {
        const bikes = await db.getBikes(currentUser.id);
        alertsContainer.innerHTML = '';

        for (const bike of bikes) {
            const alerts = await maintenanceManager.checkMaintenance(bike);
            
            alerts.forEach(alert => {
                const alertCard = document.createElement('div');
                alertCard.className = `alert-card ${alert.priority}`;
                alertCard.innerHTML = `
                    <h4>${alert.name}</h4>
                    <p>${alert.message}</p>
                    <small>Moto: ${bike.brand} ${bike.model}</small>
                `;
                alertsContainer.appendChild(alertCard);
            });
        }
    } catch (error) {
        console.error('Error al verificar alertas:', error);
    }
}

// Cargar datos guardados
function loadBikeProfile() {
    const savedData = localStorage.getItem('bikeProfile');
    if (savedData) {
        const bikeData = JSON.parse(savedData);
        document.getElementById('brand').value = bikeData.brand;
        document.getElementById('model').value = bikeData.model;
        document.getElementById('year').value = bikeData.year;
    }
}

// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Cargar perfil al iniciar
document.addEventListener('DOMContentLoaded', loadBikeProfile);

// Simulación de grupos de la comunidad
const mockGroups = [
    { name: 'Motos Clásicas', members: 1250 },
    { name: 'Rutas Off-Road', members: 850 },
    { name: 'Viajes Largos', members: 2100 }
];

function loadCommunityGroups() {
    const groupsList = document.querySelector('.groups-list');
    if (groupsList) {
        mockGroups.forEach(group => {
            const groupElement = document.createElement('div');
            groupElement.className = 'group-item';
            groupElement.innerHTML = `
                <h4>${group.name}</h4>
                <p>${group.members} miembros</p>
            `;
            groupsList.appendChild(groupElement);
        });
    }
}

// Cargar grupos al iniciar
document.addEventListener('DOMContentLoaded', loadCommunityGroups);

// Estado de autenticación
let isAuthenticated = false;

// Elementos del DOM
const authModal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const closeBtn = document.querySelector('.close');
const tabBtns = document.querySelectorAll('.tab-btn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Gestión del modal de autenticación
loginBtn.addEventListener('click', () => {
    authModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    authModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.style.display = 'none';
    }
});

// Cambio de pestañas
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (btn.dataset.tab === 'login') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }
    });
});

// Gestión de formularios
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simulación de autenticación
    if (email && password) {
        isAuthenticated = true;
        updateAuthState();
        authModal.style.display = 'none';
    }
});

document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    // Simulación de registro
    if (name && email && password) {
        isAuthenticated = true;
        updateAuthState();
        authModal.style.display = 'none';
    }
});

// Cerrar sesión
logoutBtn.addEventListener('click', () => {
    isAuthenticated = false;
    updateAuthState();
});

// Actualizar estado de autenticación
function updateAuthState() {
    if (isAuthenticated) {
        document.body.classList.add('authenticated');
        document.body.classList.remove('not-authenticated');
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        document.body.classList.add('not-authenticated');
        document.body.classList.remove('authenticated');
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
}

// Inicializar estado de autenticación
updateAuthState();

// Cargar grupos y retos
async function loadCommunityContent() {
    const groupsList = document.querySelector('.groups-list');
    const challengesList = document.querySelector('.challenges-list');

    if (groupsList) {
        const groups = await communityManager.loadGroups();
        groupsList.innerHTML = groups.map(group => `
            <div class="group-card">
                <img src="images/${group.image}" alt="${group.name}">
                <h4>${group.name}</h4>
                <p>${group.description}</p>
                <div class="group-stats">
                    <span>${group.members} miembros</span>
                    <button class="btn-primary" onclick="joinGroup(${group.id})">Unirse</button>
                </div>
            </div>
        `).join('');
    }

    if (challengesList) {
        const challenges = await communityManager.loadChallenges();
        challengesList.innerHTML = challenges.map(challenge => `
            <div class="challenge-card">
                <h4>${challenge.title}</h4>
                <p>${challenge.description}</p>
                <div class="challenge-stats">
                    <span>${challenge.participants} participantes</span>
                    <button class="btn-primary" onclick="participateInChallenge(${challenge.id})">Participar</button>
                </div>
            </div>
        `).join('');
    }
}

// Funciones de utilidad
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Cargar contenido al iniciar
document.addEventListener('DOMContentLoaded', () => {
    if (isAuthenticated) {
        loadUserBikes();
        loadCommunityContent();
    }
}); 