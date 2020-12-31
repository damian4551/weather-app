import {useState, useEffect, useRef} from 'react';

//icons
import Night from './icons/night.svg';
import Rain from './icons/rain.svg';
import Clear from './icons/clear.svg';
import Clouds from './icons/clouds.svg';
import Snow from './icons/snow.svg';
import Thunder from './icons/thunder.svg';
import Mist from './icons/mist.svg';

//functions
import {convertToCelsius, convertDate} from "./convertFunctions";

//components
import Logo from './components/Logo';
import CurrentWeather from './components/CurrentWeather';

//styling
import "./styles.scss";

function App() {

  //states and variables
  const [cities, setCities] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastWeather, setForecastWeather] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cityCoordiantes, setCityCoordinates] = useState({
    city: 'london',
    latitude: 51.509865,
    longitude: -0.118092,
  })
  const [hour, setHour] = useState(null);
  const [weatherUpdated, setWeatherUpdated] = useState(false);
  let loadingTimeout = null;

  //refs
  const bgRef = useRef();
  
  //setters
  function setInputValueState(e) {
    clearTimeout(loadingTimeout);
    setInputValue(e.target.value);
    loadingTimeout = setTimeout(function(){
      setIsLoading(true); 
    }, 1000);
  }

  function setCoordinates(city, latitude, longitude) {
    setCityCoordinates({
      city: city,
      latitude: latitude,
      longitude: longitude
    })
    setInputValue('');
  }

  function setIcon(icon) {
    switch(icon) {
      case 'Clear':
        return Clear;
      case 'Rain':
        return Rain;
      case 'Clouds':
        return Clouds;
      case 'Snow':
        return Snow;
      case 'Thunder':
          return Thunder;
      case 'Night':
          return Night;
      case 'Mist':
          return Mist;
      default:
        return Clouds;
    }
  }

  //useeffects
  useEffect(() => {
    async function fetchCity() {
      let response = await fetch(`http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=5&offset=0&namePrefix=${inputValue}`);
      let data = await response.json();
      setCities(data.data);
      setIsLoading(false);
    }
    if(isLoading) {
      fetchCity();
    }
  }, [inputValue, isLoading])

  useEffect(() => {
    async function fetchWeather() {
      let response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityCoordiantes.latitude}&lon=${cityCoordiantes.longitude}&exclude=minutely,hourly&appid=010e3df99544c1a36ac97399a02f3b02`);
      let data = await response.json();
      let forecastArray = data.daily;
      let newArray = [];
  
      forecastArray.forEach(ele => {
        newArray = [
          ...newArray,
        {
          date: ele.dt,
          temperature: ele.temp.day,
          description: ele.weather[0].main,
          icon: ele.weather[0].main,
        }]
        setForecastWeather(newArray);
      });
  
      setCurrentWeather({
        date: data.current.dt,
        temperature: data.current.temp,
        description: data.current.weather[0].description,
        icon: data.current.weather[0].main,
        pressure: data.current.pressure,
        humidity: data.current.humidity,
        clouds: data.current.clouds,
        windSpeed: data.current.wind_speed,
        sunrise: data.current.sunrise,
        sunset: data.current.sunset,
        feelsLike: data.current.feels_like,
      });
  
      setWeatherUpdated(true);
    }
    fetchWeather();
  }, [cityCoordiantes])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function(position) {
      setCityCoordinates({
        city: 'Your location',
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    });
    const newDate = new Date();
    const hour = newDate.getHours();
    setHour(hour);  
  }, [])

  if(weatherUpdated){
    setTimeout(function(){
      bgRef.current.style.opacity = 0;
    }, 3000);
    setInterval(function(){
      document.body.style.overflow = 'visible';
      bgRef.current.remove();
    }, 3500);
    
  }

  return (
    <div className="wrapper">
      <div className="inner-wrapper">
        <div className="loading-bg" ref={bgRef}>
          <div className="loading-img"></div>
        </div>
        <Logo/>
        <div className="search-container">
          <input type="text" value={inputValue} onChange={(e) => setInputValueState(e)} placeholder="search city..." />
          {inputValue !== '' && <div className="search-list">
            <ul>
              {!isLoading && cities.map(city => 
                <li key={city.id} onClick={() => setCoordinates(city.city, city.latitude, city.longitude)}>
                  <span>{city.city}</span>
                  <span>{city.countryCode}</span>
                </li>
              )}
            </ul>
            <p className="items-found">found <span>cities</span></p>
          </div>}
        </div>

        {currentWeather !== null &&
        <CurrentWeather 
          city={cityCoordiantes.city} 
          temperature={convertToCelsius(currentWeather.temperature)}
          description={currentWeather.description}
          icon={(hour > 20 || hour < 6) ? setIcon('Night') : setIcon(currentWeather.icon)}
          pressure={currentWeather.pressure}
          humidity={currentWeather.humidity}
          windSpeed={currentWeather.windSpeed}
          feelsLikeTemperature={convertToCelsius(currentWeather.feelsLike)}
        />
        }
        
        <div className="forecast-container">
          <div className="title-block">
            <span>next days</span>
          </div>
          <div className="forecast-weather-container">
          {forecastWeather !== null && forecastWeather.map(forecast => 
            <div className="weather-element" key={forecast.date}>
              <div className="forecast-weather-info">
                <p className="date">{convertDate(forecast.date).day}.{convertDate(forecast.date).month}</p>
                <p className="temperature">{convertToCelsius(forecast.temperature)}°C</p>
                <p className="description">{forecast.description}</p>
              </div>
              <img src={setIcon(forecast.icon)} alt={forecast.icon} />
            </div>
          )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
