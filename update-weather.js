const fs = require('fs');

// Наши 6 городов
const CITIES = [
  'Moscow', 'Saint Petersburg', 'Novosibirsk', 
  'Yekaterinburg', 'Kazan', 'Nizhny Novgorod'
];

const API_KEY = process.env.OPENWEATHER_API_KEY;

// Функция получения погоды для одного города
async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
    );
    const data = await response.json();
    
    return {
      temperature: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: data.wind.speed,
      weather_description: data.weather[0].description,
    };
  } catch (error) {
    console.log(`Ошибка для ${city}: ${error.message}`);
    return null;
  }
}

// Основная функция
async function main() {
  console.log('🔄 Начинаю обновление погоды...');
  
  const weatherData = {};
  const cityNames = {
    'Moscow': 'Москва',
    'Saint Petersburg': 'Санкт-Петербург', 
    'Novosibirsk': 'Новосибирск',
    'Yekaterinburg': 'Екатеринбург',
    'Kazan': 'Казань',
    'Nizhny Novgorod': 'Нижний Новгород'
  };
  
  // Обходим все города
  for (const city of CITIES) {
    console.log(`🌍 Запрашиваю: ${city}`);
    const data = await getWeather(city);
    if (data) {
      weatherData[cityNames[city]] = data;
    }
    // Ждём 1 секунду между запросами
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Добавляем время обновления
  weatherData.last_updated = new Date().toISOString();
  
  // Сохраняем в файл
  fs.writeFileSync('weather_data.json', JSON.stringify(weatherData, null, 2));
  console.log('✅ Погода обновлена!');
}

// Запускаем
main();
