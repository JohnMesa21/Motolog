class CommunityManager {
    constructor() {
        this.groups = [];
        this.challenges = [];
        this.currentUser = null;
    }

    async loadGroups() {
        // Simulación de grupos
        this.groups = [
            {
                id: 1,
                name: 'Motos Clásicas',
                description: 'Amantes de las motos clásicas y vintage',
                members: 1250,
                image: 'classic-bikes.jpg'
            },
            {
                id: 2,
                name: 'Rutas Off-Road',
                description: 'Aventureros del off-road y enduro',
                members: 850,
                image: 'off-road.jpg'
            },
            {
                id: 3,
                name: 'Viajes Largos',
                description: 'Compartiendo experiencias de viajes largos',
                members: 2100,
                image: 'long-trips.jpg'
            }
        ];
        return this.groups;
    }

    async loadChallenges() {
        // Simulación de retos
        this.challenges = [
            {
                id: 1,
                title: 'Ruta Costera 500km',
                description: 'Completa una ruta costera de al menos 500km',
                badge: 'coastal-rider',
                startDate: '2024-03-01',
                endDate: '2024-03-31',
                participants: 150
            },
            {
                id: 2,
                title: 'Desafío Off-Road',
                description: 'Completa 3 rutas off-road diferentes',
                badge: 'off-road-master',
                startDate: '2024-03-15',
                endDate: '2024-04-15',
                participants: 75
            }
        ];
        return this.challenges;
    }

    async joinGroup(groupId) {
        const group = this.groups.find(g => g.id === groupId);
        if (!group) return false;

        // Simulación de unirse a un grupo
        group.members++;
        return true;
    }

    async leaveGroup(groupId) {
        const group = this.groups.find(g => g.id === groupId);
        if (!group) return false;

        // Simulación de salir de un grupo
        group.members--;
        return true;
    }

    async participateInChallenge(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge) return false;

        // Simulación de participar en un reto
        challenge.participants++;
        return true;
    }

    async createPost(groupId, content) {
        // Simulación de crear un post
        return {
            id: Date.now(),
            groupId,
            content,
            author: this.currentUser.name,
            date: new Date().toISOString(),
            likes: 0,
            comments: []
        };
    }

    async addComment(postId, content) {
        // Simulación de agregar un comentario
        return {
            id: Date.now(),
            postId,
            content,
            author: this.currentUser.name,
            date: new Date().toISOString()
        };
    }

    async rateRoute(routeId, rating, comment) {
        // Simulación de calificar una ruta
        return {
            id: Date.now(),
            routeId,
            rating,
            comment,
            author: this.currentUser.name,
            date: new Date().toISOString()
        };
    }

    setCurrentUser(user) {
        this.currentUser = user;
    }
}

// Exportar una instancia única del gestor de comunidad
const communityManager = new CommunityManager();
export default communityManager; 