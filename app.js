/**
 * Envoryx Main Controller & Application Logic
 * Integrates state management, UI events, tab switching, and simulator interactivity.
 */

document.addEventListener('DOMContentLoaded', function() {
    EnvoryxApp.init();
});

const EnvoryxApp = {
    currentStationId: 'downtown',
    currentTab: 'overview',
    currentTheme: 'dark',
    spikeFilter: 'all',
    alertFilter: 'all',

    init: function() {
        try {
            this.bindEvents();
            this.populateStationDropdown();
            this.loadStation(this.currentStationId);
            this.initExposureCalculator();
            this.renderSpikeTable();
            this.renderAlertsList();
            this.renderStationComparison();

            const activeStation = EnvoryxData.stations.find(s => s.id === this.currentStationId);
            if (typeof EnvoryxSimulator !== 'undefined') {
                EnvoryxSimulator.init(activeStation);
            }
            this.runSimulator();
        } catch (err) {
            console.error("Initialization error in EnvoryxApp:", err);
        }
    },

    bindEvents: function() {
        // Tab Navigation
        const navLinks = document.querySelectorAll('.nav-link-item');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = link.getAttribute('data-tab');
                this.switchTab(targetTab);

                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Header Bell Alert Button shortcut to Alerts Tab
        const headerAlertsBtn = document.getElementById('header-alerts-btn');
        if (headerAlertsBtn) {
            headerAlertsBtn.addEventListener('click', () => {
                this.switchTab('alerts');
                navLinks.forEach(l => {
                    if (l.getAttribute('data-tab') === 'alerts') l.classList.add('active');
                    else l.classList.remove('active');
                });
            });
        }

        // Station Selector Dropdown
        const stationSelect = document.getElementById('station-select');
        if (stationSelect) {
            stationSelect.addEventListener('change', (e) => {
                this.loadStation(e.target.value);
            });
        }

        // Theme Toggle Switch
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Mobile Sidebar Toggle
        const mobileToggleBtn = document.getElementById('mobile-sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        if (mobileToggleBtn && sidebar) {
            mobileToggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('show');
            });
        }

        // Environmental Impact Simulator Sliders
        const simSliders = document.querySelectorAll('.sim-slider');
        simSliders.forEach(slider => {
            slider.addEventListener('input', () => {
                const valDisplay = document.getElementById(slider.id + '-val');
                if (valDisplay) {
                    let suffix = '%';
                    if (slider.id.includes('wind')) suffix = ' km/h';
                    if (slider.id.includes('rain')) suffix = ' mm/h';
                    valDisplay.textContent = (slider.value > 0 && !slider.id.includes('wind') && !slider.id.includes('rain') ? '+' : '') + slider.value + suffix;
                }
                this.runSimulator();
            });
        });

        // Simulator Presets
        const presetBtns = document.querySelectorAll('.preset-pill');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                presetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const presetKey = btn.getAttribute('data-preset');
                this.applySimulatorPreset(presetKey);
            });
        });

        // Personal Exposure Form
        const exposureForm = document.getElementById('exposure-form');
        if (exposureForm) {
            exposureForm.addEventListener('input', () => {
                this.calculatePersonalExposure();
            });
        }

        // Anomaly Spike Filters
        const spikeFilterBtns = document.querySelectorAll('.spike-filter-btn');
        spikeFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                spikeFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.spikeFilter = btn.getAttribute('data-severity');
                this.renderSpikeTable();
            });
        });

        // Smart Alert Filters
        const alertFilterBtns = document.querySelectorAll('.alert-filter-btn');
        alertFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                alertFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.alertFilter = btn.getAttribute('data-severity');
                this.renderAlertsList();
            });
        });

        // Station Comparison Table Search Input
        const compSearch = document.getElementById('comparison-search-input');
        if (compSearch) {
            compSearch.addEventListener('input', () => {
                this.renderStationComparison();
            });
        }

        // Trigger Test Alert Button
        const testAlertBtn = document.getElementById('trigger-test-alert-btn');
        if (testAlertBtn) {
            testAlertBtn.addEventListener('click', () => {
                this.triggerTestAlert();
            });
        }

        // Auto Chart Resize on Window Resize
        window.addEventListener('resize', () => {
            this.renderTabCharts(this.currentTab);
            if (this.currentTab === 'map' || this.currentTab === 'overview') {
                if (typeof EnvoryxMap !== 'undefined') EnvoryxMap.resize();
            }
        });
    },

    populateStationDropdown: function() {
        const select = document.getElementById('station-select');
        if (!select || typeof EnvoryxData === 'undefined') return;

        select.innerHTML = '';
        EnvoryxData.stations.forEach(st => {
            const opt = document.createElement('option');
            opt.value = st.id;
            opt.textContent = `${st.name} (${st.zoneType})`;
            if (st.id === this.currentStationId) opt.selected = true;
            select.appendChild(opt);
        });
    },

    switchTab: function(tabId) {
        this.currentTab = tabId;
        const views = document.querySelectorAll('.page-view');
        views.forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(`view-${tabId}`);
        if (targetView) {
            targetView.classList.add('active');
        }

        setTimeout(() => {
            this.renderTabCharts(tabId);
            if (tabId === 'map' || tabId === 'overview') {
                if (typeof EnvoryxMap !== 'undefined') EnvoryxMap.resize();
            }
        }, 50);
    },

    loadStation: function(stationId) {
        this.currentStationId = stationId;
        if (typeof EnvoryxData === 'undefined' || !EnvoryxData.stations) return;

        const station = EnvoryxData.stations.find(s => s.id === stationId) || EnvoryxData.stations[0];

        // 1. Update Header & KPI Cards Safely
        const stName = document.getElementById('current-station-name');
        if (stName) stName.textContent = station.name;
        
        const stZone = document.getElementById('current-station-zone');
        if (stZone) stZone.textContent = station.zoneType;
        
        const kpiAqi = document.getElementById('kpi-aqi-val');
        if (kpiAqi) kpiAqi.textContent = station.aqi;

        const kpiAqiStatus = document.getElementById('kpi-aqi-status');
        if (kpiAqiStatus) {
            kpiAqiStatus.textContent = station.aqiStatus;
            kpiAqiStatus.style.color = station.aqiColor;
        }

        const kpiNoise = document.getElementById('kpi-noise-val');
        if (kpiNoise) kpiNoise.textContent = station.noiseDb + ' dB';

        const kpiNoiseStatus = document.getElementById('kpi-noise-status');
        if (kpiNoiseStatus) kpiNoiseStatus.textContent = station.noiseStatus;

        const kpiWeather = document.getElementById('kpi-weather-val');
        if (kpiWeather) kpiWeather.textContent = `${station.temp}°C`;

        const kpiWeatherSub = document.getElementById('kpi-weather-sub');
        if (kpiWeatherSub) kpiWeatherSub.textContent = `Humidity: ${station.humidity}% | Wind: ${station.windSpeed} km/h ${station.windDir}`;

        const kpiRisk = document.getElementById('kpi-risk-val');
        if (kpiRisk) kpiRisk.textContent = `${station.riskScore}/100`;

        const kpiRiskStatus = document.getElementById('kpi-risk-status');
        if (kpiRiskStatus) kpiRiskStatus.textContent = station.riskStatus;

        // 2. SVG Gauge Text & Circles
        const aqiGaugeScore = document.getElementById('aqi-gauge-score');
        if (aqiGaugeScore) aqiGaugeScore.textContent = station.aqi;

        const riskGaugeScore = document.getElementById('risk-gauge-score');
        if (riskGaugeScore) riskGaugeScore.textContent = station.riskScore;

        this.updateSvgGauge('aqi-gauge-circle', station.aqi, 300, station.aqiColor);
        this.updateSvgGauge('risk-gauge-circle', station.riskScore, 100, station.riskScore > 60 ? '#ef4444' : (station.riskScore > 35 ? '#f59e0b' : '#10b981'));

        // 3. Noise Tab Elements
        const liveNoise = document.getElementById('live-noise-val');
        if (liveNoise) liveNoise.innerHTML = `${station.noiseDb} <span class="fs-5">dB</span>`;

        const liveNoiseStatus = document.getElementById('live-noise-status');
        if (liveNoiseStatus) liveNoiseStatus.textContent = station.noiseStatus;

        // 4. Pollutants Cards
        const vPm25 = document.getElementById('val-pm25');
        if (vPm25) vPm25.textContent = `${station.pm25} µg/m³`;

        const vPm10 = document.getElementById('val-pm10');
        if (vPm10) vPm10.textContent = `${station.pm10} µg/m³`;

        const vCo = document.getElementById('val-co');
        if (vCo) vCo.textContent = `${station.co} ppm`;

        const vNo2 = document.getElementById('val-no2');
        if (vNo2) vNo2.textContent = `${station.no2} ppb`;

        const vSo2 = document.getElementById('val-so2');
        if (vSo2) vSo2.textContent = `${station.so2} ppb`;

        const vO3 = document.getElementById('val-o3');
        if (vO3) vO3.textContent = `${station.o3} ppb`;

        // 5. Persistence
        const pHours = document.getElementById('persistence-hours');
        if (pHours) pHours.textContent = `${station.persistenceHours} Hours`;

        const pNote = document.getElementById('persistence-note');
        if (pNote) pNote.textContent = station.persistenceNote;

        // 6. Leaflet Map Update
        if (typeof L !== 'undefined' && typeof EnvoryxMap !== 'undefined') {
            try {
                if (!EnvoryxMap.map) {
                    EnvoryxMap.init('leaflet-map', EnvoryxData.stations, (selectedId) => {
                        const sel = document.getElementById('station-select');
                        if (sel) sel.value = selectedId;
                        this.loadStation(selectedId);
                    });
                }
                EnvoryxMap.focusStation(station);
            } catch(e) {
                console.warn("Leaflet map initialization warning:", e);
            }
        }

        // 7. Sub-routine calls
        if (typeof EnvoryxSimulator !== 'undefined') {
            EnvoryxSimulator.setBaseline(station);
            this.runSimulator();
        }
        
        this.calculatePersonalExposure();
        this.render7DayForecast(stationId);
        this.renderStationComparison();
        this.renderSpikeTable();
        this.renderAlertsList();

        // 8. Active tab charts
        this.renderTabCharts(this.currentTab);
    },

    renderTabCharts: function(tabId) {
        if (typeof EnvoryxCharts === 'undefined' || typeof EnvoryxData === 'undefined') return;

        const station = EnvoryxData.stations.find(s => s.id === this.currentStationId) || EnvoryxData.stations[0];
        const timelineData = EnvoryxData.get24HourTimeline(this.currentStationId);

        if (tabId === 'overview') {
            EnvoryxCharts.initAqiTrendChart('aqiTrendChartCanvas', timelineData);
            EnvoryxCharts.initFactorsChart('factorsChartCanvas', station.factors);
        } else if (tabId === 'air') {
            EnvoryxCharts.initPollutantsChart('pollutantsChartCanvas', station);
        } else if (tabId === 'noise') {
            EnvoryxCharts.initNoiseTimelineChart('noiseChartCanvas', timelineData);
        } else if (tabId === 'weather') {
            EnvoryxCharts.initCorrelationChart('correlationChartCanvas', timelineData);
        } else if (tabId === 'ai') {
            const forecastList = EnvoryxData.get7DayForecast(this.currentStationId);
            EnvoryxCharts.init7DayAiChart('ai7DayChartCanvas', forecastList);
        } else if (tabId === 'map') {
            EnvoryxCharts.initStationComparisonChart('comparisonChartCanvas', EnvoryxData.stations);
        } else if (tabId === 'simulator') {
            this.runSimulator();
        }
    },

    updateSvgGauge: function(circleId, score, maxVal, color) {
        const circle = document.getElementById(circleId);
        if (!circle) return;

        const radius = 70;
        const circumference = 2 * Math.PI * radius;
        const normalizedScore = Math.min(maxVal, Math.max(0, score));
        const offset = circumference - (normalizedScore / maxVal) * circumference;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
        circle.style.stroke = color;
    },

    runSimulator: function() {
        const simTraffic = document.getElementById('sim-traffic');
        const simIndustry = document.getElementById('sim-industry');
        const simWind = document.getElementById('sim-wind');
        const simRain = document.getElementById('sim-rain');
        const simCanopy = document.getElementById('sim-canopy');

        if (!simTraffic || !simIndustry || !simWind || !simRain || !simCanopy) return;
        if (typeof EnvoryxSimulator === 'undefined') return;

        const trafficChange = parseFloat(simTraffic.value);
        const industryChange = parseFloat(simIndustry.value);
        const windSpeed = parseFloat(simWind.value);
        const rainfall = parseFloat(simRain.value);
        const greenCanopy = parseFloat(simCanopy.value);

        const simResult = EnvoryxSimulator.calculate({
            trafficChange, industryChange, windSpeed, rainfall, greenCanopy
        });

        // Render Simulator Outputs
        const simAqiVal = document.getElementById('sim-aqi-val');
        if (simAqiVal) simAqiVal.textContent = simResult.aqi;

        const simAqiStatus = document.getElementById('sim-aqi-status');
        if (simAqiStatus) {
            simAqiStatus.textContent = simResult.aqiStatus;
            simAqiStatus.style.color = simResult.aqiColor;
        }

        const simNoiseVal = document.getElementById('sim-noise-val');
        if (simNoiseVal) simNoiseVal.textContent = simResult.noiseDb + ' dB';

        const simRiskVal = document.getElementById('sim-risk-val');
        if (simRiskVal) simRiskVal.textContent = simResult.riskScore + '/100';

        const simRiskStatus = document.getElementById('sim-risk-status');
        if (simRiskStatus) simRiskStatus.textContent = simResult.riskStatus;

        const simPm25Val = document.getElementById('sim-pm25-val');
        if (simPm25Val) simPm25Val.textContent = simResult.pm25 + ' µg/m³';

        const simPersistenceVal = document.getElementById('sim-persistence-val');
        if (simPersistenceVal) simPersistenceVal.textContent = simResult.persistenceHours + ' hrs to clear';

        // Delta indicator
        const aqiDeltaElem = document.getElementById('sim-aqi-delta');
        if (aqiDeltaElem) {
            const d = simResult.deltas.aqi;
            aqiDeltaElem.textContent = (d > 0 ? '+' : '') + d + ' AQI';
            aqiDeltaElem.className = 'badge ' + (d > 0 ? 'bg-danger' : (d < 0 ? 'bg-success' : 'bg-secondary'));
        }

        if (typeof EnvoryxCharts !== 'undefined') {
            EnvoryxCharts.initSimulatorChart('simulatorChartCanvas', simResult.baseline, simResult);
        }
    },

    applySimulatorPreset: function(presetKey) {
        if (typeof EnvoryxSimulator === 'undefined') return;
        const preset = EnvoryxSimulator.presets[presetKey];
        if (!preset) return;

        const simTraffic = document.getElementById('sim-traffic');
        if (simTraffic) simTraffic.value = preset.trafficChange;
        const simTrafficVal = document.getElementById('sim-traffic-val');
        if (simTrafficVal) simTrafficVal.textContent = (preset.trafficChange > 0 ? '+' : '') + preset.trafficChange + '%';

        const simIndustry = document.getElementById('sim-industry');
        if (simIndustry) simIndustry.value = preset.industryChange;
        const simIndustryVal = document.getElementById('sim-industry-val');
        if (simIndustryVal) simIndustryVal.textContent = (preset.industryChange > 0 ? '+' : '') + preset.industryChange + '%';

        const simWind = document.getElementById('sim-wind');
        if (simWind) simWind.value = preset.windSpeed;
        const simWindVal = document.getElementById('sim-wind-val');
        if (simWindVal) simWindVal.textContent = preset.windSpeed + ' km/h';

        const simRain = document.getElementById('sim-rain');
        if (simRain) simRain.value = preset.rainfall;
        const simRainVal = document.getElementById('sim-rain-val');
        if (simRainVal) simRainVal.textContent = preset.rainfall + ' mm/h';

        const simCanopy = document.getElementById('sim-canopy');
        if (simCanopy) simCanopy.value = preset.greenCanopy;
        const simCanopyVal = document.getElementById('sim-canopy-val');
        if (simCanopyVal) simCanopyVal.textContent = '+' + preset.greenCanopy + '%';

        this.runSimulator();
    },

    initExposureCalculator: function() {
        this.calculatePersonalExposure();
    },

    calculatePersonalExposure: function() {
        const activitySelect = document.getElementById('exp-activity');
        const durationSelect = document.getElementById('exp-duration');
        const groupSelect = document.getElementById('exp-group');

        if (!activitySelect || !durationSelect || !groupSelect) return;
        if (typeof EnvoryxData === 'undefined' || !EnvoryxData.stations) return;

        const activityMult = parseFloat(activitySelect.value);
        const durationHours = parseFloat(durationSelect.value);
        const groupMult = parseFloat(groupSelect.value);

        const station = EnvoryxData.stations.find(s => s.id === this.currentStationId) || EnvoryxData.stations[0];

        const rawExposure = (station.pm25 * activityMult * durationHours * groupMult) / 8.0;
        const exposureScore = Math.min(100, Math.round(rawExposure));

        let expStatus = 'Safe Outdoor Exposure';
        let expColor = '#10b981';
        let expRec = 'Safe for normal outdoor exercise and activities. No mask required.';

        if (exposureScore > 65) {
            expStatus = 'Severe Exposure Risk';
            expColor = '#ef4444';
            expRec = 'Avoid outdoor exertion. High particulate intake risk. N95 respirator recommended.';
        } else if (exposureScore > 35) {
            expStatus = 'Moderate Exposure Risk';
            expColor = '#f59e0b';
            expRec = 'Limit outdoor intense workouts. Sensitive individuals should stay indoors.';
        }

        const expVal = document.getElementById('exp-score-val');
        if (expVal) expVal.textContent = `${exposureScore} / 100`;

        const expStatusElem = document.getElementById('exp-score-status');
        if (expStatusElem) {
            expStatusElem.textContent = expStatus;
            expStatusElem.style.color = expColor;
        }

        const expRecElem = document.getElementById('exp-recommendation');
        if (expRecElem) expRecElem.textContent = expRec;
    },

    render7DayForecast: function(stationId) {
        const container = document.getElementById('7day-forecast-container');
        if (!container || typeof EnvoryxData === 'undefined') return;

        const forecastList = EnvoryxData.get7DayForecast(stationId);
        container.innerHTML = '';

        forecastList.forEach(item => {
            const card = document.createElement('div');
            card.className = 'glass-card p-3 text-center flex-fill m-1';
            card.innerHTML = `
                <div class="fw-bold text-muted mb-1">${item.day}</div>
                <div class="display-6 fw-bold my-1" style="color: ${item.color}">${item.aqi}</div>
                <span class="badge mb-2" style="background-color: ${item.color}">${item.status}</span>
                <div class="small text-muted border-top border-secondary opacity-75 pt-2 mt-1">
                    <div><strong>PM2.5:</strong> ${item.pm25} µg/m³</div>
                    <div><strong>PM10:</strong> ${item.pm10} µg/m³</div>
                    <div><strong>Noise:</strong> ${item.noise} dB</div>
                </div>
                <div class="small text-info mt-2"><i class="bi bi-cpu me-1"></i>AI ${item.confidence}</div>
            `;
            container.appendChild(card);
        });

        if (typeof EnvoryxCharts !== 'undefined') {
            EnvoryxCharts.init7DayAiChart('ai7DayChartCanvas', forecastList);
        }
    },

    renderSpikeTable: function() {
        const tbody = document.getElementById('spike-table-body');
        if (!tbody || typeof EnvoryxData === 'undefined') return;

        let spikes = EnvoryxData.getSpikeEvents();
        if (this.spikeFilter !== 'all') {
            spikes = spikes.filter(s => s.severity.toLowerCase() === this.spikeFilter.toLowerCase());
        }

        tbody.innerHTML = '';

        if (spikes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted p-3">No anomaly spikes matching filter "${this.spikeFilter}".</td></tr>`;
            return;
        }

        spikes.forEach(spk => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${spk.time}</strong></td>
                <td><span class="badge bg-dark">${spk.location}</span></td>
                <td><span class="text-warning font-weight-bold">${spk.metric}</span></td>
                <td><span class="text-danger font-weight-bold">${spk.spikeValue}</span></td>
                <td><span class="badge ${spk.severity === 'Critical' ? 'bg-danger' : (spk.severity === 'High' ? 'bg-warning text-dark' : 'bg-info')}">${spk.severity}</span></td>
                <td class="small">${spk.cause} <div class="text-muted text-xs"><i class="bi bi-cpu me-1"></i>${spk.confidence}</div></td>
                <td><button class="btn btn-sm btn-outline-info act-spike-btn"><i class="bi bi-shield-check me-1"></i>Act</button></td>
            `;
            
            const btn = tr.querySelector('.act-spike-btn');
            btn.addEventListener('click', function() {
                alert(`Action Directive Dispatched for ${spk.location}:\n\n${spk.recommendedAction}`);
            });

            tbody.appendChild(tr);
        });
    },

    renderAlertsList: function() {
        const container = document.getElementById('alerts-feed-container');
        if (!container || typeof EnvoryxData === 'undefined') return;

        let alerts = EnvoryxData.getAlerts();
        if (this.alertFilter !== 'all') {
            alerts = alerts.filter(a => a.severity.toLowerCase() === this.alertFilter.toLowerCase());
        }

        container.innerHTML = '';

        if (alerts.length === 0) {
            container.innerHTML = `<div class="p-4 text-center text-muted">No active alerts matching filter "${this.alertFilter}".</div>`;
            return;
        }

        alerts.forEach(alt => {
            const div = document.createElement('div');
            div.className = `alert alert-${alt.type} glass-card mb-3 p-3`;
            div.innerHTML = `
                <div class="d-flex align-items-start gap-3">
                    <i class="bi ${alt.icon} fs-3 text-${alt.type}"></i>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h6 class="alert-heading m-0 fw-bold">${alt.title}</h6>
                            <span class="badge bg-dark">${alt.timestamp}</span>
                        </div>
                        <div class="small mb-2">
                            <span class="badge bg-secondary me-2"><i class="bi bi-geo-alt me-1"></i>${alt.location}</span>
                            <span class="badge bg-outline-secondary me-2">Metric: ${alt.parameter}</span>
                            <span class="badge ${alt.severity === 'Critical' ? 'bg-danger' : (alt.severity === 'High' ? 'bg-warning text-dark' : 'bg-success')}">${alt.severity}</span>
                        </div>
                        <p class="m-0 small text-light">${alt.message}</p>
                        <div class="mt-2 pt-2 border-top border-secondary opacity-50 d-flex justify-content-between align-items-center small">
                            <div><strong class="text-warning"><i class="bi bi-lightbulb me-1"></i>Action:</strong> ${alt.recommendedAction}</div>
                            <button class="btn btn-xs btn-outline-light ms-2 ack-alert-btn">Acknowledge</button>
                        </div>
                    </div>
                </div>
            `;

            const btn = div.querySelector('.ack-alert-btn');
            btn.addEventListener('click', function() {
                this.textContent = 'Acknowledged ✓';
                this.className = 'btn btn-xs btn-success ms-2';
                this.disabled = true;
            });

            container.appendChild(div);
        });
    },

    triggerTestAlert: function() {
        if (typeof EnvoryxData === 'undefined') return;

        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ' just now';
        
        const newAlert = {
            id: 'alt-' + Date.now(),
            type: 'warning',
            title: 'Simulated PM10 Construction Dust Alert',
            message: 'PM10 concentration surged to 118 µg/m³ near Central Downtown Hub due to excavators.',
            timestamp: timeStr,
            location: 'Central Downtown Hub',
            parameter: 'PM10 (118 µg/m³)',
            severity: 'High',
            recommendedAction: 'Mandate dust suppression water sprays on Construction Zone 2.',
            icon: 'bi-exclamation-triangle-fill'
        };

        // Unshift directly into stored persistent alerts array
        EnvoryxData.getAlerts().unshift(newAlert);
        this.renderAlertsList();
    },

    renderStationComparison: function() {
        const cardContainer = document.getElementById('comparison-matrix-container');
        const tableBody = document.getElementById('comparison-table-body');
        const searchInput = document.getElementById('comparison-search-input');
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

        if (typeof EnvoryxData === 'undefined' || !EnvoryxData.stations) return;

        let stations = EnvoryxData.stations;
        if (query) {
            stations = stations.filter(s => s.name.toLowerCase().includes(query) || s.zoneType.toLowerCase().includes(query));
        }
        
        if (cardContainer) {
            cardContainer.innerHTML = '';
            stations.forEach(st => {
                const isActive = st.id === this.currentStationId;
                const col = document.createElement('div');
                col.className = 'col-md-4 col-sm-6 mb-3';
                col.innerHTML = `
                    <div class="glass-card h-100 ${isActive ? 'border-primary shadow' : ''}">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="m-0 fw-bold">${st.name}</h6>
                            <span class="badge" style="background-color: ${st.aqiColor}">AQI ${st.aqi}</span>
                        </div>
                        <p class="small text-muted mb-3"><i class="bi bi-geo-alt me-1"></i>${st.zoneType}</p>
                        <div class="d-flex justify-content-between border-bottom border-secondary pb-1 mb-2 small">
                            <span>PM2.5:</span> <strong>${st.pm25} µg/m³</strong>
                        </div>
                        <div class="d-flex justify-content-between border-bottom border-secondary pb-1 mb-2 small">
                            <span>PM10:</span> <strong>${st.pm10} µg/m³</strong>
                        </div>
                        <div class="d-flex justify-content-between border-bottom border-secondary pb-1 mb-2 small">
                            <span>Noise Level:</span> <strong>${st.noiseDb} dB</strong>
                        </div>
                        <div class="d-flex justify-content-between border-bottom border-secondary pb-1 mb-2 small">
                            <span>Temp / Wind:</span> <strong>${st.temp}°C / ${st.windSpeed} km/h</strong>
                        </div>
                        <div class="d-flex justify-content-between pt-1 small">
                            <span>Env. Risk Score:</span> <strong style="color: ${st.riskScore > 60 ? '#ef4444' : '#10b981'}">${st.riskScore}/100</strong>
                        </div>
                        <button class="btn btn-xs ${isActive ? 'btn-success' : 'btn-primary'} w-100 mt-3 focus-st-btn" data-id="${st.id}">
                            <i class="bi bi-crosshair me-1"></i>${isActive ? 'Active Station' : 'Focus Station'}
                        </button>
                    </div>
                `;
                
                const btn = col.querySelector('.focus-st-btn');
                btn.addEventListener('click', (e) => {
                    const stId = e.currentTarget.getAttribute('data-id');
                    const sel = document.getElementById('station-select');
                    if (sel) sel.value = stId;
                    this.loadStation(stId);
                });

                cardContainer.appendChild(col);
            });
        }

        if (tableBody) {
            tableBody.innerHTML = '';
            stations.forEach(st => {
                const isActive = st.id === this.currentStationId;
                const tr = document.createElement('tr');
                if (isActive) tr.className = 'table-active';

                tr.innerHTML = `
                    <td><strong>${st.name}</strong> ${isActive ? '<span class="badge bg-primary ms-1">Active</span>' : ''}</td>
                    <td><span class="badge bg-dark">${st.zoneType}</span></td>
                    <td><span class="badge" style="background-color: ${st.aqiColor}; color: #fff;">AQI ${st.aqi}</span> <span class="small d-block text-muted">${st.aqiStatus}</span></td>
                    <td><strong>${st.pm25}</strong> µg/m³</td>
                    <td><strong>${st.pm10}</strong> µg/m³</td>
                    <td><strong>${st.noiseDb}</strong> dB</td>
                    <td>${st.temp}°C / ${st.windSpeed} km/h</td>
                    <td><strong style="color: ${st.riskScore > 60 ? '#ef4444' : '#10b981'}">${st.riskScore} / 100</strong></td>
                    <td>
                        <button class="btn btn-sm ${isActive ? 'btn-success' : 'btn-outline-primary'} focus-table-st-btn" data-id="${st.id}">${isActive ? 'Active' : 'Focus'}</button>
                    </td>
                `;

                const btn = tr.querySelector('.focus-table-st-btn');
                btn.addEventListener('click', (e) => {
                    const stId = e.currentTarget.getAttribute('data-id');
                    const sel = document.getElementById('station-select');
                    if (sel) sel.value = stId;
                    this.loadStation(stId);
                });

                tableBody.appendChild(tr);
            });
        }

        if (typeof EnvoryxCharts !== 'undefined') {
            EnvoryxCharts.initStationComparisonChart('comparisonChartCanvas', EnvoryxData.stations);
        }
    },

    toggleTheme: function() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', this.currentTheme);
        const icon = document.querySelector('#theme-toggle-btn i');
        if (icon) {
            icon.className = this.currentTheme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
        }
    }
};

window.EnvoryxApp = EnvoryxApp;
