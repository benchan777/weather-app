const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WeatherSchema = new Schema({
    location: { type: String, require: true },
    weather: { type: String, require: true },
    temp: { type: String, require: true },
    highTemp: { type: String, require: true },
    lowTemp: { type: String, require: true },
    humidity: { type: String, require: true },
    windSpeed: { type: String, require: true },
    sunrise: { type: String, require: true },
    sunset: { type: String, require: true },
    mood: { type: String }
})

const Weather = mongoose.model('Weather', WeatherSchema)

module.exports = Weather