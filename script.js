const apikey = "094a99116cb5eeaa1ceb6f345298f200";
const apiurl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

function getWeatherData(city) {
    const currurl = `${apiurl}${city}&appid=${apikey}`;

    fetch(currurl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const temperature = data.main.temp;
                const feelsLike = data.main.feels_like;
                const humidity = data.main.humidity;
                const pressure = data.main.pressure;
                const windSpeed = data.wind.speed;
                const weather = data.weather[0].main;

                document.getElementById("currentWeather").innerHTML = `
                    <h3>Current Weather in ${city}</h3>
                    <p>Temperature: ${temperature} °C</p>
                    <p>Feels Like: ${feelsLike} °C</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Pressure: ${pressure} hPa</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                    <p>Weather: ${weather}</p>
                `;

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

                                    const date = new Date(dateTime);
                                    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });

                                    dates.push(dayOfWeek);
                                    temperatures.push(temperature);
                                    pressures.push(pressure);
                                    windSpeeds.push(windSpeed);
                                    feelsLike.push(feelsLikeTemp);
                                    humidities.push(humidity);
                                }
                            }

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
    document.querySelectorAll('.chart-card').forEach(chart => {
        chart.style.display = 'block';
    });
}

function fetchWeatherByLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const locationUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apikey}`;

    fetch(locationUrl)
        .then(response => response.json())
        .then(data => {
            getWeatherData(data.name);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            document.getElementById("res").innerText = "Error fetching weather data";
        });
}

// Get user's current location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(fetchWeatherByLocation, (error) => {
        console.error("Error getting location:", error);
        document.getElementById("res").innerText = "Unable to retrieve location";
    });
} else {
    document.getElementById("res").innerText = "Geolocation is not supported by this browser.";
}

document.getElementById("curr-btn").addEventListener("click", () => {
    const city = document.getElementById("cityname").value;
    getWeatherData(city);
});
