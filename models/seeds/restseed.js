const restaurantJson = require('../../restaurant.json')
const restaurants = restaurantJson.results
const restDB = require('../restDB')
// mongoose
const mongoose = require('mongoose')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on('error', () => {
  console.log('error');
})
db.once('open', () => {
  console.log('mongoDB connected !')
  restaurants.forEach(restaurant => {
    restDB.create({
      //id: `${restaurant.id}`,
      name: `${restaurant.name}`,
      name_en: `${restaurant.name_en}`,
      category: `${restaurant.category}`,
      image: `${restaurant.image}`,
      location: `${restaurant.location}`,
      phone: `${restaurant.phone}`,
      google_map: `${restaurant.google_map}`,
      rating: `${restaurant.rating}`,
      description: `${restaurant.description}`
    })
  })
  console.log('done');
})