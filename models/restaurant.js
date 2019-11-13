const mongoose = require('mongoose')
const Schema = mongoose.Schema

const restaurantSchema = new Schema({
  name: String,
  category: String,
  image: String,
  location: String,
  google_map: String,
  phone: String,
  rating: Number,
  description: String
})

module.exports = mongoose.model('Restaurant', restaurantSchema)