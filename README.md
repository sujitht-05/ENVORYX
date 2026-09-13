# 🌍 ENVORYX – Smart Environmental Monitoring, Anomaly Detection & Decision Support System

## 📌 Project Overview

**Envoryx** is a web-based smart environmental monitoring and decision-support dashboard designed to analyse multiple environmental parameters and provide meaningful insights about environmental conditions.

The system combines **air quality, acoustic noise, weather conditions, environmental risk, AI-based forecasting, anomaly detection, geospatial hotspot analysis, station comparison, impact simulation, personal exposure analysis, and smart environmental alerts** into a single interactive dashboard.

The main objective of Envoryx is to transform environmental data into understandable visual insights and actionable information for better environmental awareness and decision-making.

---

## 🎯 Objectives

* Monitor environmental conditions through a centralized dashboard
* Analyse air-quality parameters and AQI
* Monitor acoustic noise pollution
* Study the relationship between weather and pollution
* Forecast future environmental conditions
* Detect abnormal pollution spikes
* Identify probable causes of environmental anomalies
* Compare environmental conditions across monitoring stations
* Visualize environmental hotspots geographically
* Simulate the impact of traffic and industrial changes
* Estimate personal environmental exposure risk
* Generate smart environmental alerts
* Support data-driven environmental decision-making

---

# ❗ Problem Statement

Environmental conditions can vary significantly between different locations and time periods.

Traditional monitoring systems may present raw environmental measurements without providing an integrated view of:

* Air pollution
* Noise pollution
* Weather influence
* Pollution trends
* Environmental risk
* Pollution anomalies
* Location-based hotspots
* Personal exposure
* Possible future conditions

This makes it difficult for users to understand the overall environmental situation and take appropriate action.

**Envoryx** addresses this challenge by providing a unified environmental analytics and decision-support dashboard.

---

# 💡 Proposed Solution

Envoryx integrates environmental measurements and analytical modules into a single dashboard.

```text
Environmental Data
       ↓
Data Processing & Analysis
       ↓
┌───────────────────────────────┐
│ Air Quality                  │
│ Noise Pollution              │
│ Weather Conditions           │
│ Environmental Risk           │
└───────────────────────────────┘
       ↓
AI Forecasting & Anomaly Detection
       ↓
Hotspot Mapping & Station Comparison
       ↓
Environmental Impact Simulation
       ↓
Personal Exposure Analysis
       ↓
Smart Environmental Alerts
       ↓
Decision Support
```

---

# ✨ Key Features

## 1. 📊 Environmental Overview Dashboard

The Overview Hub provides a consolidated view of the current environmental condition.

It displays important indicators such as:

* Air Quality Index (AQI)
* Acoustic noise level
* Weather conditions
* Combined environmental risk
* AQI trends
* Pollution contributing factors
* Pollution persistence prediction

The dashboard also provides a 24-hour AQI trend with an AI forecast extension.

---

## 2. 🌫️ Air Quality Monitoring

The Air Quality module provides detailed analysis of particulate matter and gaseous pollutants.

It includes:

* PM2.5
* PM10
* AQI
* Pollutant measurements
* Pollutant comparison with safe standards
* Pollution contributing factors
* Air-quality visualizations

The system presents pollutant information through interactive charts for easier interpretation.

---

## 3. 🔊 Noise Pollution Monitoring

Envoryx includes a dedicated **Acoustic Noise Pollution Monitor**.

Features include:

* Live acoustic dB level
* Noise status classification
* Decibel spectrum visualization
* 24-hour noise timeline
* Noise threshold monitoring
* Excessive sound spike identification

The current dashboard includes a 70 dB threshold visualization for the noise timeline.

---

## 4. 🌤️ Weather & Pollution Correlation

The Weather & Correlation module analyses how meteorological conditions can influence pollution.

It considers factors such as:

* Temperature
* Humidity
* Wind speed
* Rainfall
* Particulate concentration

The system provides a weather-versus-PM2.5 scatter/trend visualization to help understand the relationship between weather and particulate pollution.

---

# 5. 🤖 AI Predictions & Anomaly Spike Detection

Envoryx includes an **AI Forecast & Spikes** module.

### 7-Day Environmental Forecast

The system provides a multi-parameter forecast covering:

* AQI
* PM2.5
* PM10
* Noise

It displays forecast information using charts and daily forecast cards.

### Anomaly Spike Detection

The system identifies environmental spike events and classifies them according to severity:

* Critical
* High
* Medium

It also provides:

* Timestamp
* Monitoring location
* Spike metric
* Observed change
* Severity
* AI-detected probable root cause
* Recommended action

This makes the system more than a simple monitoring dashboard by connecting abnormal readings with potential causes and actions.

---

# 6. 🗺️ Interactive Environmental Hotspot Map

Envoryx provides an interactive geographical visualization of environmental conditions.

The Hotspot Map includes:

* Monitoring station locations
* Environmental heat coverage
* Station markers
* Interactive map visualization
* Location-based environmental analysis

The map module is implemented using a dedicated map manager for hotspot visualization and station interaction.

---

# 7. 📍 Multi-Station Comparative Analysis

Envoryx allows environmental conditions to be compared between multiple monitoring stations.

The comparison module includes:

* Multi-station environmental parameter comparison
* Comparison charts
* Comparative analysis matrix
* Detailed comparison table
* Station search/filtering

This helps users identify which monitoring locations have relatively higher or lower environmental risks.

---

# 8. 🎛️ Environmental Impact Simulator

The **Environmental Impact Simulator** allows users to change environmental influencing factors and observe the simulated impact.

Users can adjust parameters such as:

* Traffic volume change
* Industrial output change
* Wind speed
* Rainfall
* Green canopy

The simulator recalculates environmental indicators and displays the difference from the baseline condition.

### Example Scenarios

* Increased traffic
* Reduced traffic
* Increased industrial activity
* Increased rainfall
* Increased wind
* Green/EV transition scenarios

This provides a **what-if decision-support capability** for understanding potential environmental changes.

---

# 9. 🛡️ Personal Environmental Exposure Analysis

Envoryx includes a Personal Environmental Exposure module.

The system calculates an exposure score based on factors such as:

* Current PM2.5 level
* Outdoor activity
* Duration of exposure
* User group

The result is classified into exposure levels such as:

* Safe Outdoor Exposure
* Moderate Exposure Risk
* Severe Exposure Risk

The system also provides recommendations based on the calculated exposure risk.

---

# 10. 🚨 Smart Environmental Alert Log

Envoryx provides a smart environmental alert system.

Alerts can be filtered according to severity:

* Critical
* High
* Moderate

Each alert can provide an associated recommended action, and users can acknowledge alerts through the interface.

The system also supports a test-alert interaction for demonstrating the alert workflow.

---

# 🧩 Main Modules

| Module                         | Purpose                                                  |
| ------------------------------ | -------------------------------------------------------- |
| Overview Hub                   | Provides an overall environmental summary                |
| Air Quality                    | Analyses AQI and pollutants                              |
| Noise Monitor                  | Monitors acoustic pollution                              |
| Weather & Correlation          | Analyses weather-pollution relationships                 |
| AI Forecast & Spikes           | Forecasts environmental conditions and detects anomalies |
| Hotspot Map & Compare          | Maps and compares monitoring stations                    |
| Environmental Impact Simulator | Simulates environmental changes                          |
| Personal Exposure & Alerts     | Calculates exposure risk and manages alerts              |

---

# 🏗️ System Architecture

```text
                   Envoryx 
                      │
        ┌─────────────┴─────────────┐
        │                           │
 Environmental Data            Station Data
        │                           │
        └─────────────┬─────────────┘
                      ↓
              Data Processing
                      ↓
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
   Air Quality      Noise        Weather
        │             │             │
        └─────────────┼─────────────┘
                      ↓
             Environmental Risk
                      ↓
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
   AI Forecast    Anomaly       Correlation
                  Detection
        │             │
        └─────────────┼─────────────┘
                      ↓
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
  Hotspot Map   Station Compare   Simulator
       │              │              │
       └──────────────┼──────────────┘
                      ↓
          Personal Exposure & Alerts
                      ↓
               Decision Support
```

---

# 🔄 Project Workflow

```text
Start
  ↓
Load Environmental & Station Data
  ↓
Process Environmental Parameters
  ↓
Calculate / Display Environmental Indicators
  ↓
Analyse Air Quality & Noise
  ↓
Analyse Weather-Pollution Correlation
  ↓
Generate Environmental Forecasts
  ↓
Detect Pollution Anomalies
  ↓
Identify Potential Root Causes
  ↓
Visualize Environmental Hotspots
  ↓
Compare Monitoring Stations
  ↓
Run Environmental Impact Simulations
  ↓
Calculate Personal Exposure Risk
  ↓
Generate Smart Alerts
  ↓
Environmental Decision Support
  ↓
End
```

---

# 📁 Project Structure

The current GitHub repository contains the following main files:

```text
Envoryx/
│
├── index.html
├── styles.css
├── app.js
├── charts.js
├── data.js
├── map.js
├── simulator.js
└── README.md
```

---

# 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap 5

### Data Visualization

* Chart.js

### Maps

* Leaflet.js

### Icons & UI

* Bootstrap Icons
* Responsive dashboard components

The current `index.html` loads Bootstrap 5.3 and Leaflet 1.9.4, while the project uses dedicated JavaScript modules for charts, maps, application logic, and simulation.

---

# 🚀 How to Run

## Method 1 — Open Directly

1. Download or clone the repository.
2. Open the project folder.
3. Open `index.html` in a modern web browser.

## Method 2 — Using VS Code

1. Open the **Envoryx** folder in Visual Studio Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.
5. The EcoGuard dashboard will open in your browser.

> An internet connection may be required for external libraries such as Bootstrap and Leaflet when they are loaded from their CDN URLs.

---

# 📊 Dashboard Outputs

Envoryx provides visual and analytical outputs including:

* AQI
* PM2.5
* PM10
* Noise level
* Weather information
* Environmental risk index
* 24-hour environmental trends
* Pollution contributing factors
* Pollution persistence prediction
* 7-day environmental forecasts
* Environmental anomaly events
* Probable root causes
* Recommended actions
* Environmental hotspot map
* Multi-station comparison
* Simulated environmental impact
* Personal exposure score
* Smart environmental alerts

---

# 🎯 Target Users

Envoryx can be useful for:

* 🌍 Environmental monitoring teams
* 🏙️ Urban planning teams
* 🏭 Industrial monitoring teams
* 🏫 Educational institutions
* 🏥 Public health awareness initiatives
* 🏢 Local authorities
* 👥 Citizens interested in environmental conditions

---

# 🌟 Key Advantages

* Centralized environmental monitoring
* Multiple environmental parameters in one dashboard
* Interactive visual analytics
* AI-assisted environmental forecasting
* Automated anomaly detection
* Root-cause-oriented analysis
* Location-based hotspot visualization
* Multi-station comparison
* What-if environmental simulation
* Personal exposure assessment
* Smart environmental alerts
* Decision-support capabilities

---

If you find this project useful, consider giving the repository a ⭐ Star.
