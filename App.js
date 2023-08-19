import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";

export default function App() {
  const API_KEY = "4856ff35d9438e94075280ae9afd13e5";
  const [cityName, setCityName] = useState("Mumbai");
  const [weatherData, setWeatherData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  async function fetchWeatherData(cityName) {
    setLoaded(false);
    try {
      const API = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;

      const response = await fetch(API);
      if (response.status === 200) {
        const data = await response.json();
        setWeatherData(data);
      } else {
        setWeatherData(null);
      }
      setLoaded(true);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchWeatherData(cityName);
  }, [cityName]);

  let backgroundImagePath = require("./assets/suny.jpg"); // Default background image

  if (loaded && weatherData) {
    const weatherType = weatherData.weather[0].main.toLowerCase();

    if (weatherType.includes("cloud")) {
      backgroundImagePath = require("./assets/cloudy.jpeg");
    } else if (weatherType.includes("rain")) {
      backgroundImagePath = require("./assets/rain.jpeg");
    } else if (weatherType.includes("clear")) {
      backgroundImagePath = require("./assets/clear_sky.jpeg");
    } else if (
      weatherType.includes("dizzle") ||
      weatherType.includes("drizzle")
    ) {
      backgroundImagePath = require("./assets/light_rain.jpeg");
    } else if (weatherType.includes("smoke")) {
      backgroundImagePath = require("./assets/smoke.jpg");
    } else if (weatherType.includes("dust") || weatherType.includes("sand")) {
      backgroundImagePath = require("./assets/dust.jpeg");
    } else if (weatherType.includes("haze")) {
      backgroundImagePath = require("./assets/haze.jpeg");
    } else if (weatherType.includes("fog")) {
      backgroundImagePath = require("./assets/foggy.jpg");
    } else {
      // Default background for unknown weather
      backgroundImagePath = require("./assets/default.jpeg");
    }
  }

  return (
    <ImageBackground source={backgroundImagePath} style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Enter city name"
          value={cityName}
          onChangeText={(text) => setCityName(text)}
        />
        <TouchableOpacity onPress={() => fetchWeatherData(cityName)}>
          <Text style={styles.searchButton}>Search</Text>
        </TouchableOpacity>
      </View>
      {loaded && weatherData ? (
        <View style={styles.weatherContainer}>
          <Text style={styles.cityName}>{weatherData.name}</Text>
          <Text style={styles.weatherType}>
            {weatherData.weather[0].description}
          </Text>
          <Text style={styles.temperature}>{weatherData.main.temp}°C</Text>
          <View style={styles.additionalInfo}>
            <Text>Humidity: {weatherData.main.humidity}%</Text>
            <Text>Wind Speed: {weatherData.wind.speed} m/s</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
      <StatusBar style="auto" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    flex: 1,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  searchButton: {
    backgroundColor: "blue",
    color: "white",
    padding: 10,
    borderRadius: 5,
  },
  weatherContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
  },
  cityName: {
    fontSize: 50,
    fontWeight: "bold",
  },
  weatherType: {
    fontSize: 24,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 40,
  },
  additionalInfo: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loadingText: {
    fontSize: 24,
  },
});
