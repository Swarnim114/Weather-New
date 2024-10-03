const apikey = "094a99116cb5eeaa1ceb6f345298f200";
const apiurl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

function getWeatherData() {
    const city = document.getElementById("cityname").value;
    if (city === "") {
        document.getElementById("res").innerText = "Please enter a city name";
        return;
    }

    const currurl = `${apiurl}${city}&appid=${apikey}`;

    fetch(currurl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const latitude = data.coord.lat;
                const longitude = data.coord.lon;

                const weeklyUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apikey}`;

                fetch(weeklyUrl)
                    .then(response => response.json())
                    .then(weeklyData => {
                        if (weeklyData.cod === "200") {
                            let dates = [];
                            let temperatures = [];
                            let pressures = [];
                            let windSpeeds = [];
                            let feelsLike = [];
                            let humidities = [];

                            for (let i = 0; i < weeklyData.list.length; i++) {
                                const forecast = weeklyData.list[i];
                                const dateTime = forecast.dt_txt;
                                if (dateTime.includes("12:00:00")) {
                                    const temperature = forecast.main.temp;
                                    const pressure = forecast.main.pressure;
                                    const windSpeed = forecast.wind.speed;
                                    const feelsLikeTemp = forecast.main.feels_like;
                                    const humidity = forecast.main.humidity;

                                    dates.push(dateTime.split(" ")[0]);
                                    temperatures.push(temperature);
                                    pressures.push(pressure);
                                    windSpeeds.push(windSpeed);
                                    feelsLike.push(feelsLikeTemp);
                                    humidities.push(humidity);
                                }
                            }

                            document.getElementById("res").innerText = `Weather forecast for ${city}`;
                            showCharts();
                            createChart('temperatureChart', dates, temperatures, 'Temperature (°C)', 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)');
                            createChart('pressureChart', dates, pressures, 'Pressure (hPa)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.2)');
                            createChart('windSpeedChart', dates, windSpeeds, 'Wind Speed (m/s)', 'rgba(255, 206, 86, 1)', 'rgba(255, 206, 86, 0.2)');
                            createChart('feelsLikeChart', dates, feelsLike, 'Feels Like (°C)', 'rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 0.2)');
                            createChart('humidityChart', dates, humidities, 'Humidity (%)', 'rgba(153, 102, 255, 1)', 'rgba(153, 102, 255, 0.2)');
                        } else {
                            document.getElementById("res").innerText = "Unable to retrieve forecast";
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching forecast:", error);
                        document.getElementById("res").innerText = "Error fetching forecast";
                    });
            } else {
                document.getElementById("res").innerText = "City not found";
            }
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            document.getElementById("res").innerText = "Error fetching weather data";
        });
}

function createChart(canvasId, labels, data, label, borderColor, backgroundColor) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    if (window[canvasId] instanceof Chart) {
        window[canvasId].destroy();
    }

    window[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#ffffff' }
                }
            }
        }
    });
}

function showCharts() {
    document.querySelectorAll('.chart-container').forEach(chart => {
        chart.style.display = 'block';
    });
}

document.getElementById("curr-btn").addEventListener("click", getWeatherData);
