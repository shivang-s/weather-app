import axios, { AxiosResponse } from "axios";

export interface WeatherData {
  cityName: string;
  temperature: string;
  humidity: string;
}

export namespace Api {
  const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
  export async function getWeatherByCity(
    cityName: string,
  ): Promise<WeatherData> {
    let url = `${BASE_URL}?q=${cityName}&appid=7040d6303d83bfe36cc2fad1c5a7ae97`;
    let res: AxiosResponse;

    try {
      res = await axios.get(url);
    } catch (err) {
      throw `error while getting weather from api for city ${cityName}`;
    }

    const resData = res.data;
    let data: WeatherData = {
      cityName: (resData["name"] ?? cityName) as string,
      temperature: (resData["main"]["temp"] ?? "-1") as string,
      humidity: (resData["main"]["humidity"] ?? "-1") as string,
    };

    return data;
  }
}
