export type Language = "en" | "es"

export type TranslationKey = 
  // | "search.placeholder"
  // | "weather.temperature"
  | "weather.humidity"
  | "weather.wind"
  | "weather.pressure"
  | "weather.visibility"
  | "weather.sunrise"
  | "weather.sunset"
  | "weather.high"
  | "weather.low"
  // | "favorites.title"
  // | "favorites.empty"
  | "forecast.title"
  | "page.title"
  | "page.locale"

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    // Page
    "weather.visibility": "Visibility",
    "weather.sunrise": "Sunrise",
    "weather.sunset": "Sunset",
    "weather.high": "High",
    "weather.low": "Low",
    "page.title": "Weather App",
    "weather.humidity" : "Humidity",
    "weather.wind" : "Wind",
    "weather.pressure" : "Pressure",
    "page.locale" : "en",
    "forecast.title": "Extended Forecast",
  },
  es: {
    // Page
    "weather.visibility": "Visibilidad",
    "weather.sunrise": "Amanecer",
    "weather.sunset": "Atardecer",
    "weather.high": "Máxima",
    "weather.low": "Mínima",
    "page.title": "Aplicación del Clima",
    "weather.humidity" : "Humedad",
    "weather.wind" : "Viento",
    "weather.pressure": "Presión",
    "page.locale" : "es",
    "forecast.title": "Pronóstico Extendido",
  },
}

export function getTranslation(language: Language, key: TranslationKey): string {
  return translations[language][key];
}

