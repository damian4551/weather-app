import React from 'react'

const CurrentWeather = ({city, temperature, description, icon, pressure, humidity, windSpeed, feelsLikeTemperature}) => {
    return (
        <div className="current-container">
          <div className="main-info-container">
            <div className="main-info-block">
              <p className="city">{city}</p>
              <p className="temperature">{temperature}°C</p>
              <p className="description">{description}</p>
            </div>
            <img src={icon} alt={icon} />
          </div>
          <div className="more-info-block">
            <p className="more-current-info">Pressure: <span>{pressure}hPa</span></p>
            <p className="more-current-info">Humidity: <span>{humidity}%</span></p>
            <p className="more-current-info">Wind speed: <span>{windSpeed}m/s</span></p>
            <p className="more-current-info">Feels like temperature: <span>{feelsLikeTemperature}°C</span></p>
          </div>
        </div>
    )
}

export default CurrentWeather
