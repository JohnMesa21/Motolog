class Database {
    constructor() {
        this.dbName = 'MotoLogDB';
        this.dbVersion = 1;
        this.db = null;
        this.init();
    }

    init() {
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onerror = (event) => {
            console.error('Error al abrir la base de datos:', event.target.error);
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log('Base de datos abierta correctamente');
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Crear almacén para usuarios
            if (!db.objectStoreNames.contains('users')) {
                const usersStore = db.createObjectStore('users', { keyPath: 'email' });
                usersStore.createIndex('name', 'name', { unique: false });
            }

            // Crear almacén para motos
            if (!db.objectStoreNames.contains('bikes')) {
                const bikesStore = db.createObjectStore('bikes', { keyPath: 'id', autoIncrement: true });
                bikesStore.createIndex('userId', 'userId', { unique: false });
            }

            // Crear almacén para rutas
            if (!db.objectStoreNames.contains('routes')) {
                const routesStore = db.createObjectStore('routes', { keyPath: 'id', autoIncrement: true });
                routesStore.createIndex('userId', 'userId', { unique: false });
            }
        };
    }

    // Métodos para usuarios
    async addUser(user) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            const request = store.add(user);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getUser(email) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.get(email);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Métodos para motos
    async addBike(bike) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['bikes'], 'readwrite');
            const store = transaction.objectStore('bikes');
            const request = store.add(bike);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getBikes(userId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['bikes'], 'readonly');
            const store = transaction.objectStore('bikes');
            const index = store.index('userId');
            const request = index.getAll(userId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Métodos para rutas
    async addRoute(route) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['routes'], 'readwrite');
            const store = transaction.objectStore('routes');
            const request = store.add(route);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getRoutes(userId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['routes'], 'readonly');
            const store = transaction.objectStore('routes');
            const index = store.index('userId');
            const request = index.getAll(userId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

// Exportar una instancia única de la base de datos
const db = new Database();
export default db; 