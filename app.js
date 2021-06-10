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

// Routes
app.get('/', (req, res) => {
    res.render('home')
})

app.post('/', (req, res) => {
    if (req.body.location) {
        const location = req.body.location

        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${process.env.API_KEY}`)
            .then( (response) => {
                const data = response.data
                const weather = data['weather'][0]['description']
                const temp = data['main']['temp']
                const highTemp = data['main']['temp_max']
                const lowTemp = data['main']['temp_min']
                const humidity = data['main']['humidity']
                const windSpeed = data['wind']['speed']
                const sunrise = data['sys']['sunrise']
                const sunset = data['sys']['sunset']
                res.render('home', { location, weather, temp, highTemp, lowTemp, humidity, windSpeed, sunrise, sunset })
            })
            .catch( (err) => {
                console.log(err)
            })
    } else {
        const mood = req.body.mood
        res.render('mood', { mood })
    }
})

// Start server
app.listen(port, () => {
    console.log(`Weather app listening on ${port}`)
});