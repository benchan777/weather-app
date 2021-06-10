require('dotenv').config()
const port = 3000;
const express = require('express');
const handlebars = require('express-handlebars');
const axios = require('axios')

// Initialize App
const app = express()

// Set app to use handlebars engine
app.set('view engine', 'handlebars');

// Set handlebars config
app.engine('handlebars', handlebars());

// Use Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up express static folder
app.use(express.static('public'))

// Database setup
require('./config/db-setup.js')

const Weather = require('./models/models')

// Routes
app.get('/', (req, res) => {
    res.render('home')
})

app.post('/', (req, res) => {
    if (req.body.location) {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${req.body.location}&units=imperial&appid=${process.env.API_KEY}`)
            .then( (response) => {
                let newWeather = new Weather({
                    location: response.data['name'],
                    weather: response.data['weather'][0]['description'],
                    temp: response.data['main']['temp'],
                    highTemp: response.data['main']['temp_max'],
                    lowTemp: response.data['main']['temp_min'],
                    humidity: response.data['main']['humidity'],
                    windSpeed: response.data['wind']['speed'],
                    sunrise: response.data['sys']['sunrise'],
                    sunset: response.data['sys']['sunset']
                })
                newWeather.save()
                .then( (data) => {
                    Weather.findById(data._id).lean()
                    .then( (data) => {
                        res.render('result', { data })
                    })
                    .catch( (err) => {
                        console.log(err)
                    })
                })
                .catch( (err) => {
                    console.log(err)
                })
            })
            .catch( (err) => {
                console.log(err)
            })
    } else {
        Weather.find({}).sort({ _id: -1 }).limit(1)
        .then( (data) => {
            Weather.findByIdAndUpdate(data[0]._id, { mood: req.body.mood })
            .then( () => {
                Weather.find({}).sort({ _id: -1 }).limit(1).lean()
                .then( (data) => {
                    res.render('mood', { data })
                })
                .catch( (err) => {
                    console.log(err)
                })
            })
            .catch( (err) => {
                console.log(err)
            })
        })
        .catch( (err) => {
            console.log(err)
        })
    }
})

// Start server
app.listen(port, () => {
    console.log(`Weather app listening on ${port}`)
});