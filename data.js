/**
 * Envoryx Data Layer
 * Realistic sample data for monitoring stations, air pollutants, noise, weather, and AI predictions.
 */

const EnvoryxData = {
    // Available Monitoring Stations
    stations: [
        {
            id: 'downtown',
            name: 'Central Downtown Hub',
            city: 'Metropolis',
            lat: 40.7128,
            lng: -74.0060,
            zoneType: 'Commercial / Traffic Heavy',
            aqi: 142,
            aqiStatus: 'Unhealthy for Sensitive Groups',
            aqiColor: '#ff9800',
            pm25: 58.4, // ug/m3
            pm10: 92.1, // ug/m3
            co: 1.8,    // ppm
            no2: 44.5,   // ppb
            so2: 12.3,   // ppb
            o3: 38.2,    // ppb
            noiseDb: 76.5,
            peakNoiseDb: 89.2,
            noiseStatus: 'Excessive Noise Warning',
            temp: 28.5,   // °C
            humidity: 64, // %
            windSpeed: 8.2, // km/h
            windDir: 'WSW',
            rainfall: 0.0, // mm
            riskScore: 68,
            riskStatus: 'Moderate-High Risk',
            factors: {
                traffic: 48,
                industry: 22,
                construction: 18,
                biomass: 7,
                natural: 5
            },
            persistenceHours: 5.5,
            persistenceNote: 'Moderate wind (8.2 km/h) will clear dispersion slowly over ~5.5 hours unless traffic drops.'
        },
        {
            id: 'industrial',
            name: 'Port Industrial Zone',
            city: 'Metropolis',
            lat: 40.6892,
            lng: -74.0445,
            zoneType: 'Industrial Heavy',
            aqi: 185,
            aqiStatus: 'Unhealthy',
            aqiColor: '#f44336',
            pm25: 89.2,
            pm10: 145.0,
            co: 3.4,
            no2: 68.1,
            so2: 32.5,
            o3: 24.8,
            noiseDb: 84.2,
            peakNoiseDb: 98.4,
            noiseStatus: 'High Noise Hazard',
            temp: 30.1,
            humidity: 58,
            windSpeed: 5.4,
            windDir: 'SSW',
            rainfall: 0.0,
            riskScore: 84,
            riskStatus: 'High Environmental Risk',
            factors: {
                traffic: 20,
                industry: 58,
                construction: 12,
                biomass: 6,
                natural: 4
            },
            persistenceHours: 9.2,
            persistenceNote: 'Low wind & stagnant industrial plume. High persistence expected for 9+ hours.'
        },
        {
            id: 'greenpark',
            name: 'Eco Green Valley Park',
            city: 'Metropolis',
            lat: 40.7829,
            lng: -73.9654,
            zoneType: 'Residential & Forest Reserve',
            aqi: 38,
            aqiStatus: 'Good',
            aqiColor: '#4caf50',
            pm25: 9.1,
            pm10: 18.5,
            co: 0.4,
            no2: 11.2,
            so2: 2.1,
            o3: 42.0,
            noiseDb: 42.8,
            peakNoiseDb: 54.0,
            noiseStatus: 'Quiet / Optimal',
            temp: 26.2,
            humidity: 71,
            windSpeed: 12.5,
            windDir: 'NW',
            rainfall: 0.2,
            riskScore: 18,
            riskStatus: 'Low Risk / Healthy',
            factors: {
                traffic: 15,
                industry: 5,
                construction: 5,
                biomass: 25,
                natural: 50
            },
            persistenceHours: 1.0,
            persistenceNote: 'High green canopy absorption & brisk wind. Air clears rapidly.'
        },
        {
            id: 'suburban',
            name: 'North Suburban Township',
            city: 'Metropolis',
            lat: 40.8500,
            lng: -73.9200,
            zoneType: 'Residential Suburb',
            aqi: 72,
            aqiStatus: 'Moderate',
            aqiColor: '#ffeb3b',
            pm25: 22.4,
            pm10: 45.1,
            co: 0.9,
            no2: 24.0,
            so2: 5.6,
            o3: 31.4,
            noiseDb: 54.2,
            peakNoiseDb: 66.5,
            noiseStatus: 'Normal Ambient',
            temp: 27.0,
            humidity: 62,
            windSpeed: 10.1,
            windDir: 'W',
            rainfall: 0.0,
            riskScore: 39,
            riskStatus: 'Moderate Risk',
            factors: {
                traffic: 40,
                industry: 15,
                construction: 25,
                biomass: 10,
                natural: 10
            },
            persistenceHours: 3.0,
            persistenceNote: 'Stable atmospheric condition. Minor persistence expected.'
        },
        {
            id: 'techcorridor',
            name: 'Silicon Corridor Expressway',
            city: 'Metropolis',
            lat: 40.7500,
            lng: -73.9800,
            zoneType: 'High-Density Commercial',
            aqi: 115,
            aqiStatus: 'Unhealthy for Sensitive Groups',
            aqiColor: '#ff9800',
            pm25: 41.2,
            pm10: 78.6,
            co: 1.4,
            no2: 38.9,
            so2: 8.9,
            o3: 36.1,
            noiseDb: 71.8,
            peakNoiseDb: 84.0,
            noiseStatus: 'Elevated Noise',
            temp: 29.0,
            humidity: 60,
            windSpeed: 7.5,
            windDir: 'SW',
            rainfall: 0.0,
            riskScore: 58,
            riskStatus: 'Moderate-High Risk',
            factors: {
                traffic: 65,
                industry: 10,
                construction: 15,
                biomass: 5,
                natural: 5
            },
            persistenceHours: 4.2,
            persistenceNote: 'Traffic congestion driving particulate concentration. Clearing by late evening.'
        }
    ],

    // Anomaly Spike Events Data Store
    spikes: [
        {
            id: 'spk-001',
            time: '10:45 AM today',
            location: 'Port Industrial Zone',
            metric: 'PM2.5 & SO₂',
            spikeValue: '142 µg/m³ (+120% jump)',
            severity: 'Critical',
            cause: 'Boiler Flare & Heavy Diesel Truck Idle Queue',
            confidence: '94% AI Confidence',
            recommendedAction: 'Issue industrial emissions throttling order & redirect freight traffic.'
        },
        {
            id: 'spk-002',
            time: '08:15 AM today',
            location: 'Central Downtown Hub',
            metric: 'Noise & CO',
            spikeValue: '91.4 dB & 2.6 ppm',
            severity: 'High',
            cause: 'Morning Rush Hour Bottleneck & Jackhammer Construction',
            confidence: '89% AI Confidence',
            recommendedAction: 'Deploy traffic wardens & enforce sound barrier compliance on Site 4.'
        },
        {
            id: 'spk-003',
            time: 'Yesterday 09:30 PM',
            location: 'Silicon Corridor Expressway',
            metric: 'NO₂ & PM10',
            spikeValue: '84.0 ppb (+75%)',
            severity: 'Medium',
            cause: 'Atmospheric Inversion & Heavy Fleet Transit',
            confidence: '91% AI Confidence',
            recommendedAction: 'Activate dynamic speed limits to smooth traffic flow.'
        },
        {
            id: 'spk-004',
            time: 'Yesterday 04:20 PM',
            location: 'North Suburban Township',
            metric: 'PM10 & Dust',
            spikeValue: '110 µg/m³ (+95%)',
            severity: 'Medium',
            cause: 'Uncovered Demolition Dust Plume',
            confidence: '88% AI Confidence',
            recommendedAction: 'Deploy water spraying tankers & fine site contractor.'
        }
    ],

    // Active Smart Alerts Log Data Store
    alerts: [
        {
            id: 'alt-101',
            type: 'danger',
            title: 'Hazardous Air Quality Threshold Exceeded',
            message: 'PM2.5 crossed 85 µg/m³ at Port Industrial Zone. High health risk for sensitive individuals.',
            timestamp: '12 mins ago',
            location: 'Port Industrial Zone',
            parameter: 'PM2.5 (89.2 µg/m³)',
            severity: 'Critical',
            recommendedAction: 'Issue health advisory & order emission reduction at Terminal 3.',
            icon: 'bi-exclamation-triangle-fill'
        },
        {
            id: 'alt-102',
            type: 'warning',
            title: 'Excessive Acoustic Noise Alert',
            message: 'Ambient sound level reached 89.2 dB in Downtown Hub exceeding safe city limit (70 dB).',
            timestamp: '35 mins ago',
            location: 'Central Downtown Hub',
            parameter: 'Noise (89.2 dB)',
            severity: 'High',
            recommendedAction: 'Enforce noise barriers & divert heavy commercial vehicle traffic.',
            icon: 'bi-volume-up-fill'
        },
        {
            id: 'alt-103',
            type: 'info',
            title: 'Stagnant Wind & Thermal Inversion Warning',
            message: 'Wind speed dropped below 5 km/h. Reduced dispersion rate will sustain pollution persistence.',
            timestamp: '1 hour ago',
            location: 'Metropolis Valley Basin',
            parameter: 'Wind Speed (4.2 km/h)',
            severity: 'Moderate',
            recommendedAction: 'Alert municipal health office and monitor particulate buildup.',
            icon: 'bi-wind'
        },
        {
            id: 'alt-104',
            type: 'success',
            title: 'Green Canopy Filtration Active',
            message: 'Eco Green Park station reporting 72% lower PM2.5 compared to adjacent highway corridors.',
            timestamp: '3 hours ago',
            location: 'Eco Green Valley Park',
            parameter: 'PM2.5 (9.1 µg/m³)',
            severity: 'Optimal',
            recommendedAction: 'Maintain urban green space expansion initiative.',
            icon: 'bi-tree-fill'
        }
    ],

    // Generate historical 24-hour timeline data for line charts
    get24HourTimeline: function(stationId) {
        const hours = [];
        const now = new Date();
        const station = this.stations.find(s => s.id === stationId) || this.stations[0];
        
        const baseAqi = station.aqi;
        const basePm25 = station.pm25;
        const baseNoise = station.noiseDb;
        const baseWind = station.windSpeed;
        const baseHumidity = station.humidity;

        const aqiTrend = [];
        const pm25Trend = [];
        const noiseTrend = [];
        const windTrend = [];
        const humidityTrend = [];
        const aiForecastAqi = [];

        for (let i = 23; i >= 0; i--) {
            const h = new Date(now.getTime() - i * 3600 * 1000);
            const timeLabel = h.getHours().toString().padStart(2, '0') + ':00';
            hours.push(timeLabel);

            const hourOfDay = h.getHours();
            const cycleFactor = Math.sin((hourOfDay - 6) * Math.PI / 12);
            
            const randomNoise = (Math.random() - 0.5) * 8;
            const aqiVal = Math.max(10, Math.round(baseAqi + cycleFactor * 30 + randomNoise));
            const pm25Val = Math.max(2, parseFloat((basePm25 + cycleFactor * 15 + (Math.random() - 0.5) * 4).toFixed(1)));
            const noiseVal = Math.max(35, parseFloat((baseNoise + cycleFactor * 10 + (Math.random() - 0.5) * 6).toFixed(1)));
            const windVal = Math.max(1, parseFloat((baseWind + Math.cos(hourOfDay) * 3 + (Math.random() - 0.5) * 2).toFixed(1)));
            const humVal = Math.min(95, Math.max(20, Math.round(baseHumidity - cycleFactor * 15 + (Math.random() - 0.5) * 5)));

            aqiTrend.push(aqiVal);
            pm25Trend.push(pm25Val);
            noiseTrend.push(noiseVal);
            windTrend.push(windVal);
            humidityTrend.push(humVal);
        }

        const forecastLabels = [];
        for (let i = 1; i <= 12; i++) {
            const h = new Date(now.getTime() + i * 3600 * 1000);
            forecastLabels.push(h.getHours().toString().padStart(2, '0') + ':00');
            const hourOfDay = h.getHours();
            const cycleFactor = Math.sin((hourOfDay - 6) * Math.PI / 12);
            const forecastVal = Math.max(15, Math.round(baseAqi + cycleFactor * 25 - (i > 6 ? 10 : -5)));
            aiForecastAqi.push(forecastVal);
        }

        return {
            labels: hours,
            aqi: aqiTrend,
            pm25: pm25Trend,
            noise: noiseTrend,
            wind: windTrend,
            humidity: humidityTrend,
            forecastLabels: forecastLabels,
            forecastAqi: aiForecastAqi
        };
    },

    // 7-day AI forecast returning AQI, PM2.5, PM10, Noise dB
    get7DayForecast: function(stationId) {
        const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
        const station = this.stations.find(s => s.id === stationId) || this.stations[0];
        
        return days.map((day, idx) => {
            const delta = (idx % 2 === 0 ? 1 : -1) * (idx * 6) + Math.round((Math.random() - 0.5) * 12);
            const predictedAqi = Math.max(20, Math.min(300, station.aqi + delta));
            const predictedPm25 = Math.max(5.0, parseFloat((station.pm25 + delta * 0.45).toFixed(1)));
            const predictedPm10 = Math.max(12.0, parseFloat((station.pm10 + delta * 0.7).toFixed(1)));
            const predictedNoise = Math.max(40, Math.min(95, Math.round(station.noiseDb + (Math.random() - 0.5) * 6)));
            
            let status = 'Good';
            let color = '#4caf50';
            if (predictedAqi > 150) { status = 'Unhealthy'; color = '#f44336'; }
            else if (predictedAqi > 100) { status = 'Unhealthy (Sensitive)'; color = '#ff9800'; }
            else if (predictedAqi > 50) { status = 'Moderate'; color = '#ffeb3b'; }

            return {
                day: day,
                aqi: predictedAqi,
                pm25: predictedPm25,
                pm10: predictedPm10,
                noise: predictedNoise,
                status: status,
                color: color,
                confidence: (96.5 - idx * 2.1).toFixed(1) + '%'
            };
        });
    },

    // Pollution Spike Anomaly Detection Events
    getSpikeEvents: function() {
        return this.spikes;
    },

    // Active Smart Alerts Log
    getAlerts: function() {
        return this.alerts;
    }
};

window.EnvoryxData = EnvoryxData;
