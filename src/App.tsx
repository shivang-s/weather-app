import { PlusIcon, Trash2 } from "lucide-react";
import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import { Input } from "./components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { useEffect, useState } from "react";
import { Api, WeatherData } from "./api";

function App() {
  const [tbData, setTbData] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);

  const onAddCityClick = () => {
    if (!tbData) return;
    setCities((prev) => [...prev, tbData]);
    setTbData("");
  };

  const onCityNameUpdate = (id: number, name: string) => {
    setCities((prev) => {
      prev[id] = name;
      return prev;
    });
  };

  const onCityDelete = (id: number) => {
    setCities((prev) => {
      return prev.filter((_, ind) => ind != id);
    });
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div id="app" className="flex flex-col w-xl p-8 items-center">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="city_name"
            onChange={(e) => setTbData(e.target.value)}
            value={tbData}
            placeholder="City"
          />
          <Button type="submit" variant={"secondary"} onClick={onAddCityClick}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap max-w-max">
          {cities.map((v, ind) => (
            <WeatherCard
              key={v}
              cityName={v}
              id={ind}
              onNameChange={onCityNameUpdate}
              onDeletePress={onCityDelete}
            />
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
}

function WeatherCard(props: {
  cityName: string;
  id: number;
  onNameChange: (id: number, value: string) => void;
  onDeletePress: (id: number) => void;
}) {
  const [data, setData] = useState<WeatherData | undefined>();
  const [tbData, setTbData] = useState<string>("");

  useEffect(() => {
    Api.getWeatherByCity(props.cityName)
      .then((res) => {
        setData(res);
        setTbData(res.cityName);
      })
      .catch((err) => {
        alert(err);
        props.onDeletePress(props.id);
      });
  }, []);

  const onUpdateClick = () => {
    if (tbData == data?.cityName) return;
    props.onNameChange(props.id, tbData);
    setData(undefined);
    Api.getWeatherByCity(tbData)
      .then((res) => {
        setData(res);
        setTbData(res.cityName);
      })
      .catch((err) => {
        alert(err);
        props.onDeletePress(props.id);
      });
  };

  const onDeletePress = () => {
    props.onDeletePress(props.id);
  };

  return (
    <Card className="max-w-fit m-8">
      {data == undefined ? (
        "Loading..."
      ) : (
        <div>
          <CardHeader className="flex-row items-center justify-between">
            Weather in
            <Popover>
              <PopoverTrigger className="pl-1">{data.cityName}</PopoverTrigger>
              <PopoverContent>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="city_name"
                    value={tbData}
                    placeholder="City"
                    onChange={(e) => setTbData(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant={"secondary"}
                    onClick={onUpdateClick}
                  >
                    Update
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              className="size-7 ml-8"
              size={"icon"}
              variant={"destructive"}
              onClick={onDeletePress}
            >
              <Trash2 className="size-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <h4>{(Number(data.temperature) - 273.15).toFixed(2)}°C</h4>
            <p>Precipitaion: {data.humidity}%</p>
          </CardContent>
        </div>
      )}
    </Card>
  );
}

export default App;
