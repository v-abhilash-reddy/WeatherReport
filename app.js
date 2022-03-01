const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const { copyFileSync } = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    console.log("in the get /");
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    console.log("in the post /");
    console.log(req.body);
    const city = req.body.city;
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=c001c7783318123f92704d529ab22e81#";

    https.get(url, response => {
        console.log(typeof (response.statusCode));
        if (response.statusCode === Number(404)) {
            res.sendFile(__dirname + "/404.html");
        }
        else {
            response.on("data", data => {
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const { description, icon } = weatherData.weather[0];
                const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

                res.set("Content-Type", "text/html");
                //OR
                res.setHeader("Content-Type", "text/html");

                res.send(`
                <body style="background-color:rgb(255, 204, 204);">
                <center> 
                <h2>Weather Conditions :   <span style="color:blue;"> ${description} </span></h2>
                <img src="${imageURL}">
                <h1>The temperature in <span style="color:blue;"> ${city}</span> is <span style = "color:blue;">${temp}</span> ° Celsius.</h1>
                </center>
                </body>
                `);
            });
        }
    });
});

app.post("/404", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on PORT 3000...");
});