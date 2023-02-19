const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restSchema = new Schema({
  //id: {type: Number,required: true},
  name: {type: String,required: true},
  name_en: {type: String},
  category: {type: String,required: true},
  image: {type: String,required: true},
  location: {type: String,required: true},
  phone: {type: String,required: true},
  google_map: {type: String},
  rating: {type: Number,required: true},
  description: {type: String}
})

module.exports = mongoose.model('restaurant', restSchema)