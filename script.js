const apikey = "094a99116cb5eeaa1ceb6f345298f200";
const apiurl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

function currentWeather() {
    const city = document.getElementById("cityname").value;
    if (city === "") {
        document.getElementById("res").innerText = "Please enter a city name";
        return;
    }

    const requestUrl = `${apiurl}${city}&appid=${apikey}`;

    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const temperature = data.main.temp;
                const feelsLike = data.main.feels_like;
                const humidity = data.main.humidity;
                const pressure = data.main.pressure;
                const windSpeed = data.wind.speed;
                const weatherDescription = data.weather[0].description;
                const icon = data.weather[0].icon;
                const latitude = data.coord.lat;
                const longitude = data.coord.lon;

                document.getElementById("res").innerHTML = `
                    <h3>Weather in ${city}</h3>
                    <p> Latitude : ${latitude}  </p>
                    <p> Longitude : ${longitude}  </p>
                    <p><strong>Temperature:</strong> ${temperature} °C</p>
                    <p><strong>Feels Like:</strong> ${feelsLike} °C</p>
                    <p><strong>Humidity:</strong> ${humidity}%</p>
                    <p><strong>Pressure:</strong> ${pressure} hPa</p>
                    <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
                    <p><strong>Description:</strong> ${weatherDescription}</p>
                    <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather icon">
                `;
            } else {
                document.getElementById("res").innerText = "City not found";
            }
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            document.getElementById("res").innerText = "Error fetching weather data";
        });
}

document.getElementById("curr-btn").addEventListener("click", currentWeather);

function getWeeklyData() {
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
                            let forecastHTML = `<h3>5-Day Weather Forecast for ${city}</h3>`;
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
                                    const weatherDescription = forecast.weather[0].description;
                                    const icon = forecast.weather[0].icon;

                                    dates.push(dateTime.split(" ")[0]);
                                    temperatures.push(temperature);
                                    pressures.push(pressure);
                                    windSpeeds.push(windSpeed);
                                    feelsLike.push(feelsLikeTemp);
                                    humidities.push(humidity);

                                    forecastHTML += `
                                        <h4>Date: ${dateTime.split(" ")[0]}</h4>
                                        <p><strong>Temperature:</strong> ${temperature} °C</p>
                                        <p><strong>Feels Like:</strong> ${feelsLikeTemp} °C</p>
                                        <p><strong>Humidity:</strong> ${humidity}%</p>
                                        <p><strong>Pressure:</strong> ${pressure} hPa</p>
                                        <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
                                        <p><strong>Description:</strong> ${weatherDescription}</p>
                                        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather icon">
                                        <hr>
                                    `;
                                }
                            }
                            document.getElementById("res").innerHTML = forecastHTML;
                            createChart(dates, temperatures, pressures, windSpeeds, feelsLike, humidities);
                        } else {
                            document.getElementById("res").innerText = "Unable to retrieve weekly forecast";
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching weekly weather data:", error);
                        document.getElementById("res").innerText = "Error fetching weekly weather data";
                    });
            } else {
                document.getElementById("res").innerText = "City not found";
            }
        })
        .catch(error => {
            console.error("Error fetching current weather data:", error);
            document.getElementById("res").innerText = "Error fetching current weather data";
        });
}

function createChart(dates, temperatures, pressures, windSpeeds, feelsLike, humidities) {
    const ctx = document.getElementById('weatherChart').getContext('2d');

    if (window.weatherChart instanceof Chart) {
        window.weatherChart.destroy();
    }

    window.weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temperatures,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    yAxisID: 'y-temperature',
                },
                {
                    label: 'Pressure (hPa)',
                    data: pressures,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    yAxisID: 'y-pressure',
                },
                {
                    label: 'Wind Speed (m/s)',
                    data: windSpeeds,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    yAxisID: 'y-wind',
                },
                {
                    label: 'Feels Like (°C)',
                    data: feelsLike,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    yAxisID: 'y-temperature',
                },
                {
                    label: 'Humidity (%)',
                    data: humidities,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    yAxisID: 'y-humidity',
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            stacked: false,
            plugins: {
                title: {
                    display: true,
                    text: '5-Day Weather Forecast',
                    color: '#ffffff',
                },
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    id: 'y-temperature',
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                'y-pressure': {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    id: 'y-pressure',
                    grid: {
                        drawOnChartArea: false,
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                'y-wind': {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    id: 'y-wind',
                    grid: {
                        drawOnChartArea: false,
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                'y-humidity': {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    id: 'y-humidity',
                    grid: {
                        drawOnChartArea: false,
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

// Update the event listener
document.getElementById("week-btn").addEventListener("click", getWeeklyData);
