/**
 * Envoryx Leaflet Map Manager
 * Handles interactive hotspot visualization, station markers, heat circles, and map layers.
 */

const EnvoryxMap = {
    map: null,
    markers: [],
    circles: [],
    activeStationId: null,
    onStationSelectCallback: null,

    init: function(elementId, stations, onSelectCallback) {
        if (!document.getElementById(elementId)) return;
        
        this.onStationSelectCallback = onSelectCallback;

        // Base Map setup - center on middle of station points
        this.map = L.map(elementId, {
            zoomControl: true,
            scrollWheelZoom: true
        }).setView([40.7450, -73.9850], 11);

        // Tile layer: CartoDB Dark Matter / Positron for modern sleek dark aesthetics
        const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        });
        darkTiles.addTo(this.map);

        this.renderStations(stations);
    },

    renderStations: function(stations) {
        // Clear existing markers & circles
        this.markers.forEach(m => this.map.removeLayer(m));
        this.circles.forEach(c => this.map.removeLayer(c));
        this.markers = [];
        this.circles = [];

        stations.forEach(station => {
            const color = station.aqiColor;
            
            // Custom HTML Icon Pin
            const customIcon = L.divIcon({
                className: 'custom-map-pin',
                html: `
                    <div class="map-pin-wrapper" style="background-color: ${color};">
                        <span class="pin-aqi">${station.aqi}</span>
                        <span class="pin-pulse" style="background-color: ${color};"></span>
                    </div>
                `,
                iconSize: [42, 42],
                iconAnchor: [21, 21],
                popupAnchor: [0, -22]
            });

            // Marker creation
            const marker = L.marker([station.lat, station.lng], { icon: customIcon }).addTo(this.map);
            
            // Popup HTML Content
            const popupContent = `
                <div class="map-popup-card">
                    <div class="popup-header d-flex justify-content-between align-items-center mb-2">
                        <h6 class="m-0 font-weight-bold">${station.name}</h6>
                        <span class="badge" style="background-color: ${color}; color: #fff;">AQI ${station.aqi}</span>
                    </div>
                    <p class="small text-muted mb-2"><i class="bi bi-geo-alt-fill me-1"></i> ${station.zoneType}</p>
                    <div class="popup-grid">
                        <div class="popup-item">
                            <span class="label">PM2.5:</span>
                            <span class="val">${station.pm25} µg/m³</span>
                        </div>
                        <div class="popup-item">
                            <span class="label">Noise:</span>
                            <span class="val">${station.noiseDb} dB</span>
                        </div>
                        <div class="popup-item">
                            <span class="label">Temp/Wind:</span>
                            <span class="val">${station.temp}°C / ${station.windSpeed} km/h</span>
                        </div>
                        <div class="popup-item">
                            <span class="label">Risk Score:</span>
                            <span class="val font-weight-bold" style="color: ${station.riskScore > 60 ? '#f44336' : '#4caf50'}">${station.riskScore}/100</span>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-primary w-100 mt-2 select-station-btn" data-id="${station.id}">
                        <i class="bi bi-crosshair me-1"></i> Focus Dashboard Here
                    </button>
                </div>
            `;

            marker.bindPopup(popupContent);
            
            marker.on('popupopen', () => {
                const btn = document.querySelector(`.select-station-btn[data-id="${station.id}"]`);
                if (btn) {
                    btn.addEventListener('click', () => {
                        if (this.onStationSelectCallback) {
                            this.onStationSelectCallback(station.id);
                        }
                    });
                }
            });

            this.markers.push(marker);

            // Add Pollution Hotspot Coverage Heat Circle
            const circleRadius = Math.max(1200, station.aqi * 25);
            const circle = L.circle([station.lat, station.lng], {
                color: color,
                fillColor: color,
                fillOpacity: 0.22,
                radius: circleRadius,
                weight: 1.5
            }).addTo(this.map);

            this.circles.push(circle);
        });
    },

    focusStation: function(station) {
        if (!this.map || !station) return;
        this.map.flyTo([station.lat, station.lng], 13, {
            duration: 1.2
        });
    },

    resize: function() {
        if (this.map) {
            setTimeout(() => this.map.invalidateSize(), 300);
        }
    }
};

window.EnvoryxMap = EnvoryxMap;
