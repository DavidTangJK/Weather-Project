const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { env } = require("process");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  const city = req.body.cityName;
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + process.env.API_KEY + "&units=metric";
  https.get(url, function(response){

    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const desc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.set('Content-Type', 'text/html');
      res.write("<img src=" + imageURL + ">");
      res.write("<h1>The temperature in " + city + " is now " + temp + "&#176;Celcius.</h1>");
      res.write("<p>The weather is now " + desc + "</p>");
      res.send();
    });
  });
})





app.listen(3000, function(){
  console.log("Server is running on 3000.");
})
