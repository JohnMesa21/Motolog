class MapManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.currentRoute = null;
        this.directionsService = null;
        this.directionsRenderer = null;
    }

    initMap() {
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 40.4168, lng: -3.7038 },
            zoom: 6,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.TOP_RIGHT
            }
        });

        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            map: this.map,
            suppressMarkers: false
        });

        // Agregar controles personalizados
        this.addCustomControls();
    }

    addCustomControls() {
        // Control de tipo de ruta
        const routeTypeControl = document.createElement('div');
        routeTypeControl.className = 'route-type-control';
        routeTypeControl.innerHTML = `
            <select id="route-type">
                <option value="DRIVING">Carretera</option>
                <option value="BICYCLING">Off-road</option>
            </select>
        `;
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(routeTypeControl);

        // Control de puntos de interés
        const poiControl = document.createElement('div');
        poiControl.className = 'poi-control';
        poiControl.innerHTML = `
            <button id="show-gas-stations">Gasolineras</button>
            <button id="show-workshops">Talleres</button>
            <button id="show-viewpoints">Miradores</button>
        `;
        this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(poiControl);
    }

    async calculateRoute(origin, destination, waypoints = []) {
        const routeType = document.getElementById('route-type').value;
        
        const request = {
            origin: origin,
            destination: destination,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode[routeType],
            optimizeWaypoints: true
        };

        try {
            const result = await this.directionsService.route(request);
            this.directionsRenderer.setDirections(result);
            this.currentRoute = result;
            return result;
        } catch (error) {
            console.error('Error al calcular la ruta:', error);
            throw error;
        }
    }

    addMarker(position, title, icon = null) {
        const marker = new google.maps.Marker({
            position: position,
            map: this.map,
            title: title,
            icon: icon
        });
        this.markers.push(marker);
        return marker;
    }

    clearMarkers() {
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];
    }

    async searchNearbyPlaces(type, location, radius = 5000) {
        const service = new google.maps.places.PlacesService(this.map);
        
        return new Promise((resolve, reject) => {
            service.nearbySearch({
                location: location,
                radius: radius,
                type: type
            }, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(results);
                } else {
                    reject(status);
                }
            });
        });
    }

    saveRoute(routeData) {
        // Guardar ruta en la base de datos
        return db.addRoute({
            ...routeData,
            userId: currentUser.id,
            date: new Date().toISOString()
        });
    }

    loadSavedRoutes() {
        // Cargar rutas guardadas de la base de datos
        return db.getRoutes(currentUser.id);
    }
}

// Exportar una instancia única del gestor de mapas
const mapManager = new MapManager();
export default mapManager; 