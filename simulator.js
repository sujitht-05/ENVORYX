/**
 * Envoryx Environmental Impact Simulator Engine
 * Recalculates real-time air quality, noise levels, risk score, and persistence based on input parameters.
 */

const EnvoryxSimulator = {
    baselineStation: null,

    init: function(station) {
        this.baselineStation = station;
    },

    setBaseline: function(station) {
        this.baselineStation = station;
    },

    /**
     * Compute simulated metrics given input parameters:
     * params = { trafficChange, industryChange, windSpeed, rainfall, greenCanopy }
     */
    calculate: function(params) {
        const base = this.baselineStation || EnvoryxData.stations[0];
        
        const trafficFactor = 1 + (params.trafficChange / 100);
        const industryFactor = 1 + (params.industryChange / 100);
        const windSpeed = parseFloat(params.windSpeed);
        const rainfall = parseFloat(params.rainfall);
        const greenCanopy = parseFloat(params.greenCanopy);

        // 1. Dispersion & Washout Adjustments
        let windDispersionFactor = 1.0;
        if (windSpeed < 5) {
            windDispersionFactor = 1.25 - (windSpeed * 0.05);
        } else {
            windDispersionFactor = Math.max(0.4, 1.0 - ((windSpeed - 5) * 0.015));
        }

        let rainWashoutFactor = 1.0;
        if (rainfall > 0) {
            rainWashoutFactor = Math.max(0.35, 1.0 - (rainfall * 0.025));
        }

        const greenFiltrationFactor = Math.max(0.6, 1.0 - (greenCanopy * 0.008));

        // 2. Compute Individual Pollutants
        const rawPm25 = base.pm25 * (0.45 * trafficFactor + 0.35 * industryFactor + 0.20);
        const simPm25 = Math.max(1.0, parseFloat((rawPm25 * windDispersionFactor * rainWashoutFactor * greenFiltrationFactor).toFixed(1)));

        const rawPm10 = base.pm10 * (0.50 * trafficFactor + 0.30 * industryFactor + 0.20);
        const simPm10 = Math.max(2.0, parseFloat((rawPm10 * windDispersionFactor * rainWashoutFactor * greenFiltrationFactor).toFixed(1)));

        const rawNo2 = base.no2 * (0.65 * trafficFactor + 0.25 * industryFactor + 0.10);
        const simNo2 = Math.max(2.0, parseFloat((rawNo2 * windDispersionFactor).toFixed(1)));

        const rawSo2 = base.so2 * (0.10 * trafficFactor + 0.85 * industryFactor + 0.05);
        const simSo2 = Math.max(0.5, parseFloat((rawSo2 * windDispersionFactor).toFixed(1)));

        const rawCo = base.co * (0.70 * trafficFactor + 0.20 * industryFactor + 0.10);
        const simCo = Math.max(0.1, parseFloat((rawCo * windDispersionFactor).toFixed(1)));

        const simO3 = Math.max(5.0, parseFloat((base.o3 * (1 + (base.temp - 25) * 0.02) * (1 / (1 + windSpeed * 0.01))).toFixed(1)));

        // 3. Compute Simulated AQI from PM2.5
        let simAqi = 0;
        if (simPm25 <= 12.0) simAqi = Math.round((simPm25 / 12.0) * 50);
        else if (simPm25 <= 35.4) simAqi = Math.round(51 + ((simPm25 - 12.1) / (35.4 - 12.1)) * 49);
        else if (simPm25 <= 55.4) simAqi = Math.round(101 + ((simPm25 - 35.5) / (55.4 - 35.5)) * 49);
        else if (simPm25 <= 150.4) simAqi = Math.round(151 + ((simPm25 - 55.5) / (150.4 - 55.5)) * 49);
        else simAqi = Math.round(201 + ((simPm25 - 150.5) / (250.0 - 150.5)) * 99);

        // 4. Compute Simulated Noise Level (dB)
        const noiseTrafficDelta = Math.log10(trafficFactor) * 12.0;
        const noiseIndustryDelta = Math.log10(industryFactor) * 6.0;
        const noiseRainDampening = rainfall > 5 ? -1.5 : 0;
        const noiseCanopyAbsorption = greenCanopy * -0.06;

        const simNoiseDb = Math.max(35.0, parseFloat((base.noiseDb + noiseTrafficDelta + noiseIndustryDelta + noiseRainDampening + noiseCanopyAbsorption).toFixed(1)));

        // 5. Compute Combined Environmental Risk Score (0 - 100)
        const normAqiRisk = Math.min(100, (simAqi / 250) * 100);
        const normNoiseRisk = Math.min(100, Math.max(0, (simNoiseDb - 40) / 50 * 100));
        const simRiskScore = Math.min(100, Math.max(0, Math.round(0.55 * normAqiRisk + 0.30 * normNoiseRisk + 0.15 * (100 - greenCanopy * 1.5))));

        // 6. Persistence Forecast
        let simPersistence = 0;
        if (simAqi <= 50) {
            simPersistence = 0.5;
        } else {
            const clearanceRate = (windSpeed * 1.2) + (rainfall * 2.5) + (greenCanopy * 0.5) + 2.0;
            simPersistence = parseFloat((Math.max(0.5, (simAqi - 50) / clearanceRate)).toFixed(1));
        }

        let aqiStatus = 'Good';
        let aqiColor = '#4caf50';
        if (simAqi > 200) { aqiStatus = 'Very Unhealthy / Hazardous'; aqiColor = '#9c27b0'; }
        else if (simAqi > 150) { aqiStatus = 'Unhealthy'; aqiColor = '#f44336'; }
        else if (simAqi > 100) { aqiStatus = 'Unhealthy for Sensitive Groups'; aqiColor = '#ff9800'; }
        else if (simAqi > 50) { aqiStatus = 'Moderate'; aqiColor = '#ffeb3b'; }

        let riskStatus = 'Low Risk';
        let riskColor = '#4caf50';
        if (simRiskScore > 75) { riskStatus = 'Severe Risk'; riskColor = '#f44336'; }
        else if (simRiskScore > 50) { riskStatus = 'High Risk'; riskColor = '#ff9800'; }
        else if (simRiskScore > 30) { riskStatus = 'Moderate Risk'; riskColor = '#ffeb3b'; }

        return {
            baseline: base,
            params: params,
            aqi: simAqi,
            aqiStatus: aqiStatus,
            aqiColor: aqiColor,
            pm25: simPm25,
            pm10: simPm10,
            no2: simNo2,
            so2: simSo2,
            co: simCo,
            o3: simO3,
            noiseDb: simNoiseDb,
            riskScore: simRiskScore,
            riskStatus: riskStatus,
            riskColor: riskColor,
            persistenceHours: simPersistence,
            deltas: {
                aqi: simAqi - base.aqi,
                pm25: parseFloat((simPm25 - base.pm25).toFixed(1)),
                pm10: parseFloat((simPm10 - base.pm10).toFixed(1)),
                noise: parseFloat((simNoiseDb - base.noiseDb).toFixed(1)),
                risk: simRiskScore - base.riskScore
            }
        };
    },

    presets: {
        baseline: { trafficChange: 0, industryChange: 0, windSpeed: 8, rainfall: 0, greenCanopy: 10 },
        rushhour: { trafficChange: 75, industryChange: 10, windSpeed: 4, rainfall: 0, greenCanopy: 10 },
        industrial_night: { trafficChange: -20, industryChange: 80, windSpeed: 3, rainfall: 0, greenCanopy: 10 },
        monsoon_cleansing: { trafficChange: -15, industryChange: -10, windSpeed: 24, rainfall: 35, greenCanopy: 20 },
        green_transition: { trafficChange: -40, industryChange: -35, windSpeed: 12, rainfall: 0, greenCanopy: 45 }
    }
};

window.EnvoryxSimulator = EnvoryxSimulator;
