const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require("dotenv").config();

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/weather", function (req, res) {
  const city = req.body.cityName;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&APPID=" +
    process.env.API_KEY +
    "&units=metric";
  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temparature = weatherData.main.temp;
      const desc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.render("weather", {
        city: city,
        temparature: temparature,
        weather: desc,
        imageURL: imageURL,
      });
    });
  });
});

app.post("/", function (req, res) {
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server is running on 3000.");
});
