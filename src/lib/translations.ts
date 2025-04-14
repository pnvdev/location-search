export type Language = "en" | "es"

export type TranslationKey = 
  | "search.placeholder"
  | "weather.humidity"
  | "weather.wind"
  | "weather.pressure"
  | "weather.visibility"
  | "weather.sunrise"
  | "weather.sunset"
  | "weather.high"
  | "weather.low"
  | "favorites.title"
  | "favorites.empty"
  | "forecast.title"
  | "page.title"
  | "page.locale"
  | "footer.credits";

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
    "search.placeholder": "Search for a city...",
    "favorites.title": "Favorites",
    "favorites.empty": "No favorites yet",
    "footer.credits" : "Made with ❤️ by",
  },
  es: {
    // Page
    "weather.visibility": "Visibilidad",
    "weather.sunrise": "Amanecer",
    "weather.sunset": "Atardecer",
    "weather.high": "Máxima",
    "weather.low": "Mínima",
    "page.title": "App de Clima",
    "weather.humidity" : "Humedad",
    "weather.wind" : "Viento",
    "weather.pressure": "Presión",
    "page.locale" : "es",
    "forecast.title": "Pronóstico Extendido",
    "search.placeholder": "Buscar una ciudad...",
    "favorites.title": "Favoritos",
    "favorites.empty": "No hay favoritos aún",
    "footer.credits" : "Creado con ❤️ por",
  },
}

export function getTranslation(language: Language, key: TranslationKey): string {
  return translations[language][key];
}

