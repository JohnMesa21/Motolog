class MaintenanceManager {
    constructor() {
        this.alerts = [];
        this.maintenanceTypes = {
            OIL_CHANGE: {
                name: 'Cambio de aceite',
                interval: 5000, // km
                icon: 'oil-can'
            },
            TIRE_CHANGE: {
                name: 'Cambio de neumáticos',
                interval: 15000, // km
                icon: 'tire'
            },
            CHAIN_CLEANING: {
                name: 'Limpieza de cadena',
                interval: 1000, // km
                icon: 'chain'
            },
            BRAKE_CHECK: {
                name: 'Revisión de frenos',
                interval: 10000, // km
                icon: 'brake'
            }
        };
    }

    async checkMaintenance(bike) {
        const currentKm = bike.kilometers || 0;
        const lastMaintenance = bike.lastMaintenance || {};
        
        this.alerts = [];

        for (const [type, data] of Object.entries(this.maintenanceTypes)) {
            const lastKm = lastMaintenance[type] || 0;
            const kmSinceLast = currentKm - lastKm;
            
            if (kmSinceLast >= data.interval) {
                this.alerts.push({
                    type: type,
                    name: data.name,
                    icon: data.icon,
                    currentKm: currentKm,
                    lastKm: lastKm,
                    interval: data.interval,
                    priority: this.calculatePriority(kmSinceLast, data.interval)
                });
            }
        }

        return this.alerts;
    }

    calculatePriority(kmSinceLast, interval) {
        const percentage = (kmSinceLast / interval) * 100;
        
        if (percentage > 150) return 'high';
        if (percentage > 120) return 'medium';
        return 'low';
    }

    async saveMaintenance(bikeId, maintenanceType, kilometers) {
        const bike = await db.getBike(bikeId);
        if (!bike) return false;

        bike.lastMaintenance = bike.lastMaintenance || {};
        bike.lastMaintenance[maintenanceType] = kilometers;

        return db.updateBike(bike);
    }

    getMaintenanceHistory(bikeId) {
        return db.getMaintenanceHistory(bikeId);
    }

    formatAlert(alert) {
        return {
            title: alert.name,
            message: `Necesario desde ${alert.lastKm} km. Actual: ${alert.currentKm} km`,
            priority: alert.priority,
            icon: alert.icon
        };
    }
}

// Exportar una instancia única del gestor de mantenimiento
const maintenanceManager = new MaintenanceManager();
export default maintenanceManager; 