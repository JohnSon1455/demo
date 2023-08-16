<template>
  <div class="container">
    <div class="left-info">
      <div class="pic-gradient"></div>
      <div class="today-info">
        <h2>{{ todayInfo.day }}</h2>
        <span>{{ todayInfo.date }}</span>
        <div>
          <i class="bx bx-current-location"></i>
          <span>{{ location }}</span>
        </div>
      </div>
      <div class="today-weather">
        <i :class="weatherIcon"></i>
        <h1 class="weather-temp">{{ temperature }}</h1>
        <h3>{{ weatherDescription }}</h3>
      </div>
    </div>

    <div class="right-info">
      <div class="day-info">
        <div v-for="(info, index) in dayInfo" :key="index">
          <span class="title">{{ info.title }}</span>
          <span class="value">{{ info.value }}</span>
        </div>
      </div>

      <ul class="days-list">
        <li v-for="(day, index) in daysWeather" :key="index">
          <i :class="day.icon"></i>
          <span>{{ day.abbreviation }}</span>
          <span class="day-temp">{{ day.temp }}</span>
        </li>
      </ul>

      <div class="btn-container">
        <button class="loc-button" @click="handleLocationSearch">Search Location</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      apiKey: '3fa3a4d867811cf0dc55aee96180ae75',
      location: '',
      temperature: '',
      weatherDescription: '',
      weatherIcon: '',
      todayInfo: {
        day: '',
        date: ''
      },
      dayInfo: [
        { title: 'PRECIPITATION', value: '' },
        { title: 'HUMIDITY', value: '' },
        { title: 'WIND SPEED', value: '' }
      ],
      daysWeather: [],
      weatherIconMap: {
        '01d': 'sun',
        '01n': 'moon',
        '02d': 'sun',
        '02n': 'moon',
        '03d': 'cloud',
        '03n': 'cloud',
        '04d': 'cloud',
        '04n': 'cloud',
        '09d': 'cloud-rain',
        '09n': 'cloud-rain',
        '10d': 'cloud-rain',
        '10n': 'cloud-rain',
        '11d': 'cloud-lightning',
        '11n': 'cloud-lightning',
        '13d': 'cloud-snow',
        '13n': 'cloud-snow',
        '50d': 'water',
        '50n': 'water'
      },
    };
  },
  mounted() {
    this.fetchWeatherData('Taipei'); // Default location
  },
  methods: {
    fetchWeatherData(location) {
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${this.apiKey}&units=metric`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          // Update today's info
          const todayData = data.list[0];
          this.weatherDescription = todayData.weather[0].description;
          this.temperature = `${Math.round(todayData.main.temp)}°C`;
          this.weatherIcon = `bx bx-${this.weatherIconMap[todayData.weather[0].icon]}`;
          this.location = `${data.city.name}, ${data.city.country}`;

          // Update today's info in the "day-info" section
          this.dayInfo[0].value = `${todayData.pop}%`;
          this.dayInfo[1].value = `${todayData.main.humidity}%`;
          this.dayInfo[2].value = `${todayData.wind.speed} km/h`;

          // Update next 4 days weather
          const today = new Date();
          this.todayInfo.day = today.toLocaleDateString('en', { weekday: 'long' });
          this.todayInfo.date = today.toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' });
          const nextDaysData = data.list.slice(1);
          const uniqueDays = new Set();
          this.daysWeather = []; // Clear the array before updating

          for (const dayData of nextDaysData) {
            const forecastDate = new Date(dayData.dt_txt);
            const dayAbbreviation = forecastDate.toLocaleDateString('en', { weekday: 'short' });
            const dayTemp = `${Math.round(dayData.main.temp)}°C`;
            const iconCode = dayData.weather[0].icon;

            // Ensure the day isn't duplicate and today
            if (!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()) {
              uniqueDays.add(dayAbbreviation);
              this.daysWeather.push({
                icon: `bx bx-${this.weatherIconMap[iconCode]}`,
                abbreviation: dayAbbreviation,
                temp: dayTemp,
              });
            }

            // Stop after getting 4 distinct days
            if (this.daysWeather.length === 4) break;
          }
        })
        .catch(error => {
          alert(`Error fetching weather data: ${error} (Api Error)`);
        });
    },
    handleLocationSearch() {
      const location = prompt('Enter a location:');
      if (!location) return;

      this.fetchWeatherData(location);
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}

body{
    background-color: #37474f;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container{
    height: 400px;
    background-color: #232931;
    color: #fff;
    border-radius: 25px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
}

.left-info{
    width: 260px;
    height: 100%;
    float: left;
    display: flex;
    border-radius: 25px;
    justify-content: center;
    background-position: center;
    background-size: cover;
    transform: scale(1.03) perspective(200px);
    cursor: pointer;
    box-shadow: 0 0 20px -10px rrgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.left-info:hover{
    transform: scale(1.1) perspective(2500px) rotateY(5deg);
}

.pic-gradient{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(135deg, #5c6bc0 10%, #0d47a1 100%);
    border-radius: 25px;
    opacity: 0.5;
}

.today-info{
    position: absolute;
    display: flex;
    flex-direction: column;
    margin-top: 25px;
}

.day-info{
  text-align: left;
}

.today-weather{
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    bottom: 20px;
    left: 20px;
}

.today-weather .bx{
    font-size: 4.6rem;
}

.weather-temp{
    font-weight: 700;
    font-size: 3.5rem;
}

.right-info{
    float: right;
    position: relative;
    height: 100%;
    padding-top: 25px;
}

.day-info{
    padding: 25px 35px;
    display: flex;
    flex-direction: column;
}

.day-info div:not(:last-child){
    margin-bottom: 6px;
}

.day-info div .title{
    font-weight: 700;
}

.day-info div .value{
    float: right;
}

.days-list{
    display: flex;
    list-style: none;
    margin: 10px 35px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
    border-radius: 10px;
}

.days-list li{
    padding: 15px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    transition: all 0.3s ease;
}

.days-list li .bx{
    margin-bottom: 5px;
    font-size: 2rem;
}

.days-list li:hover{
    transform: scale(1.1);
    background: #fff;
    color: #222831;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
}

.days-list li .day-temp{
    margin-top: 6px;
    font-weight: 700;
}

.btn-container{
    padding: 25px 35px;
}

.loc-button{
    outline: none;
    width: 100%;
    border: none;
    font-weight: 700;
    border-radius: 25px;
    padding: 10px;
    background: #303f9f;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
    transition: all 0.3s ease;
}

.loc-button:hover{
    background: #1a237e;
}
</style>

