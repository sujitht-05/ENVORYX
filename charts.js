/**
 * Envoryx Chart Engine (Chart.js Integrations)
 * Initializes and updates interactive charts across all tabs safely.
 */

const EnvoryxCharts = {
    instances: {},

    getGradient: function(ctx, colorStart, colorEnd) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);
        return gradient;
    },

    /**
     * 1. Initialize AQI 24H & AI Forecast Chart
     */
    initAqiTrendChart: function(canvasId, timelineData) {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.instances.aqiTrend) this.instances.aqiTrend.destroy();

        const fullLabels = [...timelineData.labels, ...timelineData.forecastLabels];
        const historicalAqi = [...timelineData.aqi];
        const forecastArray = new Array(timelineData.labels.length).fill(null);
        forecastArray[timelineData.labels.length - 1] = historicalAqi[historicalAqi.length - 1];
        timelineData.forecastAqi.forEach(val => forecastArray.push(val));

        this.instances.aqiTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: fullLabels,
                datasets: [
                    {
                        label: 'Historical AQI (24h)',
                        data: [...historicalAqi, ...new Array(timelineData.forecastLabels.length).fill(null)],
                        borderColor: '#2196f3',
                        backgroundColor: 'rgba(33, 150, 243, 0.15)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3
                    },
                    {
                        label: 'AI Forecast AQI (+12h)',
                        data: forecastArray,
                        borderColor: '#ff9800',
                        borderWidth: 2.5,
                        borderDash: [6, 4],
                        backgroundColor: 'rgba(255, 152, 0, 0.08)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#ff9800'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { labels: { color: '#888', font: { family: 'Outfit, sans-serif' } } },
                    tooltip: { padding: 12, cornerRadius: 8 }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#888' } },
                    y: { grid: { color: 'rgba(200, 200, 200, 0.1)' }, ticks: { color: '#888' }, beginAtZero: true }
                }
            }
        });
    },

    /**
     * 2. Initialize Pollutant Breakdown Chart
     */
    initPollutantsChart: function(canvasId, station) {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.instances.pollutants) this.instances.pollutants.destroy();

        const categories = ['PM2.5', 'PM10', 'NO₂', 'SO₂', 'CO (x10)', 'O₃'];
        const values = [station.pm25, station.pm10, station.no2, station.so2, station.co * 10, station.o3];
        const safeLimits = [15, 45, 25, 20, 40, 60];

        this.instances.pollutants = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [
                    {
                        label: 'Current Concentration',
                        data: values,
                        backgroundColor: [
                            'rgba(244, 67, 54, 0.8)',
                            'rgba(255, 152, 0, 0.8)',
                            'rgba(255, 235, 59, 0.8)',
                            'rgba(33, 150, 243, 0.8)',
                            'rgba(156, 39, 176, 0.8)',
                            'rgba(76, 175, 80, 0.8)'
                        ],
                        borderRadius: 6
                    },
                    {
                        label: 'WHO Safe Standard Threshold',
                        data: safeLimits,
                        type: 'line',
                        borderColor: '#00bcd4',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointStyle: 'rectRot',
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#888' } } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#888' } },
                    y: { grid: { color: 'rgba(200, 200, 200, 0.1)' }, ticks: { color: '#888' }, beginAtZero: true }
                }
            }
        });
    },

    /**
     * 3. Noise dB Timeline & Spike Chart
     */
    initNoiseTimelineChart: function(canvasId, timelineData) {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.instances.noise) this.instances.noise.destroy();

        const excessiveThreshold = new Array(timelineData.labels.length).fill(70);

        this.instances.noise = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timelineData.labels,
                datasets: [
                    {
                        label: 'Acoustic Sound Level (dB)',
                        data: timelineData.noise,
                        borderColor: '#e91e63',
                        backgroundColor: 'rgba(233, 30, 99, 0.15)',
                        fill: true,
                        tension: 0.3,
                        borderWidth: 3
                    },
                    {
                        label: 'Safe Urban Noise Threshold (70 dB)',
                        data: excessiveThreshold,
                        borderColor: '#ff9800',
                        borderWidth: 2,
                        borderDash: [4, 4],
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#888' } } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#888' } },
                    y: { grid: { color: 'rgba(200, 200, 200, 0.1)' }, ticks: { color: '#888' }, min: 30, max: 100 }
                }
            }
        });
    },

    /**
     * 4. Weather-Pollution Correlation Chart
     */
    initCorrelationChart: function(canvasId, timelineData) {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.instances.correlation) this.instances.correlation.destroy();

        this.instances.correlation = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timelineData.labels,
                datasets: [
                    {
                        label: 'PM2.5 (µg/m³)',
                        data: timelineData.pm25,
                        borderColor: '#f44336',
                        yAxisID: 'yPollutant',
                        tension: 0.3,
                        borderWidth: 2.5
                    },
                    {
                        label: 'Wind Speed (km/h)',
                        data: timelineData.wind,
                        borderColor: '#00bcd4',
                        backgroundColor: 'rgba(0, 188, 212, 0.1)',
                        fill: true,
                        yAxisID: 'yWeather',
                        tension: 0.3,
                        borderWidth: 2
                    },
                    {
                        label: 'Humidity (%)',
                        data: timelineData.humidity,
                        borderColor: '#9c27b0',
                        borderDash: [3, 3],
                        yAxisID: 'yWeather',
                        tension: 0.3,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend: { labels: { color: '#888' } } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#888' } },
                    yPollutant: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'PM2.5 (µg/m³)', color: '#f44336' },
                        grid: { color: 'rgba(200, 200, 200, 0.1)' },
                        ticks: { color: '#888' }
                    },
                    yWeather: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Wind Speed / Humidity', color: '#00bcd4' },
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#888' }
                    }
                }
            }
        });
    },

    /**
     * 5. Factors Doughnut Chart
     */
    initFactorsChart: function(canvasId, factors) {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.instances.factors) this.instances.factors.destroy();

        this.instances.factors = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Vehicular Traffic', 'Industrial Emissions', 'Construction Dust', 'Biomass / Heating', 'Natural / Windblown'],
                datasets: [
                    {
                        data: [factors.traffic, factors.industry, factors.construction, factors.biomass, factors.natural],
                        backgroundColor: ['#ff9800', '#f44336', '#ffeb3b', '#8bc34a', '#00bcd4'],
                        borderWidth: 0,
                        hoverOffset: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: '#888', font: { family: 'Outfit, sans-serif' } } }
                },
                cutout: '70%'
            }
        });
    },

    /**
     * 6. Environmental Impact Simulator Comparison Chart
     */
    initSimulatorChart: function(canvasId, baseline, simulated) {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.instances.simulator) this.instances.simulator.destroy();

        this.instances.simulator = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['AQI Index', 'PM2.5 (µg/m³)', 'PM10 (µg/m³)', 'Noise Level (dB)', 'Env. Risk Score'],
                datasets: [
                    {
                        label: 'Baseline (Current)',
                        data: [baseline.aqi, baseline.pm25, baseline.pm10, baseline.noiseDb, baseline.riskScore],
                        backgroundColor: 'rgba(158, 158, 158, 0.7)',
                        borderRadius: 6
                    },
                    {
                        label: 'Simulated Scenario',
                        data: [simulated.aqi, simulated.pm25, simulated.pm10, simulated.noiseDb, simulated.riskScore],
                        backgroundColor: simulated.aqi > baseline.aqi ? 'rgba(244, 67, 54, 0.85)' : 'rgba(76, 175, 80, 0.85)',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#888' } } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#888' } },
                    y: { grid: { color: 'rgba(200, 200, 200, 0.1)' }, ticks: { color: '#888' }, beginAtZero: true }
                }
            }
        });
    },

    /**
     * 7. 7-Day AI Forecast Trend Chart
     */
    init7DayAiChart: function(canvasId, forecastList) {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.instances.ai7Day) this.instances.ai7Day.destroy();

        const labels = forecastList.map(item => item.day);
        const aqiData = forecastList.map(item => item.aqi);
        const pm25Data = forecastList.map(item => item.pm25);
        const pm10Data = forecastList.map(item => item.pm10);
        const noiseData = forecastList.map(item => item.noise);

        this.instances.ai7Day = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Predicted AQI',
                        data: aqiData,
                        borderColor: '#ff9800',
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        fill: true,
                        tension: 0.3,
                        borderWidth: 3
                    },
                    {
                        label: 'PM2.5 (µg/m³)',
                        data: pm25Data,
                        borderColor: '#f44336',
                        borderWidth: 2,
                        tension: 0.3
                    },
                    {
                        label: 'PM10 (µg/m³)',
                        data: pm10Data,
                        borderColor: '#2196f3',
                        borderDash: [4, 4],
                        borderWidth: 2,
                        tension: 0.3
                    },
                    {
                        label: 'Noise (dB)',
                        data: noiseData,
                        borderColor: '#9c27b0',
                        borderWidth: 2,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend: { labels: { color: '#888' } } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#888' } },
                    y: { grid: { color: 'rgba(200, 200, 200, 0.1)' }, ticks: { color: '#888' }, beginAtZero: true }
                }
            }
        });
    },

    /**
     * 8. Station Comparative Analysis Chart
     */
    initStationComparisonChart: function(canvasId, stations) {
        if (typeof Chart === 'undefined') return;
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.instances.comparison) this.instances.comparison.destroy();

        const labels = stations.map(s => s.name);
        const aqiVals = stations.map(s => s.aqi);
        const pm25Vals = stations.map(s => s.pm25);
        const pm10Vals = stations.map(s => s.pm10);
        const noiseVals = stations.map(s => s.noiseDb);
        const riskVals = stations.map(s => s.riskScore);

        this.instances.comparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'AQI Index',
                        data: aqiVals,
                        backgroundColor: 'rgba(255, 152, 0, 0.85)',
                        borderRadius: 4
                    },
                    {
                        label: 'PM2.5 (µg/m³)',
                        data: pm25Vals,
                        backgroundColor: 'rgba(244, 67, 54, 0.85)',
                        borderRadius: 4
                    },
                    {
                        label: 'PM10 (µg/m³)',
                        data: pm10Vals,
                        backgroundColor: 'rgba(33, 150, 243, 0.85)',
                        borderRadius: 4
                    },
                    {
                        label: 'Noise Level (dB)',
                        data: noiseVals,
                        backgroundColor: 'rgba(233, 30, 99, 0.85)',
                        borderRadius: 4
                    },
                    {
                        label: 'Env Risk Score',
                        data: riskVals,
                        backgroundColor: 'rgba(139, 92, 246, 0.85)',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#888' } } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#888' } },
                    y: { grid: { color: 'rgba(200, 200, 200, 0.1)' }, ticks: { color: '#888' }, beginAtZero: true }
                }
            }
        });
    }
};

window.EnvoryxCharts = EnvoryxCharts;
