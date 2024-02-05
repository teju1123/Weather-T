import React, { useState } from "react";
import axios from "axios";
import weather from "./Weather.css";
function Weather() {
  const [inputStr, setInputStr] = useState("");
  const API_KEY = "1635890035cbba097fd5c26c8ea672a1";
  const [weatherData, setWeatherData] = useState([]);
  const fetchWeatherApi = (e) => {
    e.preventDefault();
    // console.log("input city", e);
    const postUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${inputStr}&appid=${API_KEY}`;
    axios
      .get(postUrl)
      .then((response) => {
        console.log("response", response);
        if (response.data && response.data.list) {
          //group the data by date
          const groupedData = groupDataByDate(response.data.list);
          setWeatherData(groupedData);
        } else {
          setWeatherData([]);
        }
      })
      .catch((error) => {
        window.alert("Something is invalid can you check again");
      });
  };
  //it is to group weather data by date and calculate average temperature
  const groupDataByDate = (data) => {
    const groupedData = {};
    const currentDate = new Date().toLocaleDateString();
    data.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      //it is for excluding current date
      if (date !== currentDate) {
        if (!groupedData[date]) {
          groupedData[date] = {
            temperature: 0,
            pressure: 0,
            humidity: 0,
            count: 0,
          };
        }
        groupedData[date].temperature += item.main.temp;
        groupedData[date].pressure += item.main.pressure;
        groupedData[date].humidity += item.main.humidity;
        groupedData[date].count++;
      }
    });
    console.log("goruuu", groupedData);
    //calculating average temperature for each day
    Object.keys(groupedData).forEach((date) => {
      groupedData[date].temperature /= groupedData[date].count;
      groupedData[date].pressure /= groupedData[date].count;
      groupedData[date].humidity /= groupedData[date].count;
    });

    return groupedData;
  };
  return (
    <div>
        <div className="cont-header">
          <h1>Weather in your City</h1>
        </div>
        <form onSubmit={fetchWeatherApi}>
          <div className="input-str">
            <input
              type="text"
              placeholder="City"
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
              required
            ></input>
          </div>
          <div className="submit">
            <button type="submit">Search</button>
          </div>
        </form>
        <div>
          <div>
            {Object.keys(weatherData).map((date, index) => (
              <div key={index} className="table-container">
                <h2>Date: {date}</h2>
                <table>
                  <tbody>
                    <tr>
                      <th>Temperature</th>
                      <td>{Math.round(weatherData[date].temperature)}</td>
                    </tr>
                    <tr>
                      <th>Pressure</th>
                      <td>{Math.round(weatherData[date].pressure)}</td>
                    </tr>
                    <tr>
                      <th>Humidity</th>
                      <td>{Math.round(weatherData[date].humidity)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}
export default Weather;
