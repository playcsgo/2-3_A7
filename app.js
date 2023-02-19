// Express
const express = require('express')
const app = express()
const port = 3000

// Express-handlebars
const exphbs = require('express-handlebars')
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

// Mongoose and env
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)  //required by mongoose
mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection
db.on('error', () => {
  console.log(error)
})
db.once('open', () => {
  console.log('mongoDB connected !')
})

// models.restDB
const restDB = require('./models/restDB')

// static file
app.use(express.static('public'))

// body-parser
app.use(express.urlencoded({ extended: true }))

// 新增餐廳  create
app.get('/restaurants/create', (req, res) => {
  res.render('create')
})
app.post('/restaurants/new', (req, res) => {
  restDB.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 瀏覽特定餐廳  detail
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  restDB.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
})

// 瀏覽全部餐廳
app.get('/', (req, res) => {
  restDB.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(err => console.log(err))
})

// 修改餐廳資訊
app.get('/restaurants/:id/eidt', (req, res) => {
  const id = req.params.id
  restDB.findById(id)
    .lean()
    .then(restaurant => res.render('edit', {restaurant}))
    .catch(err => console.log(err))
})
app.post('/restaurants/:id/new', (req, res) => {
  const id = req.params.id
  return restDB.findById(id)
    .then(restaurant => {
      restaurant.name = req.body.name
      restaurant.name_en = req.body.name_en
      restaurant.category = req.body.category
      restaurant.image = req.body.image
      restaurant.location = req.body.location
      restaurant.phone = req.body.phone
      restaurant.google_map = req.body.google_map
      restaurant.rating = req.body.rating
      restaurant.description = req.body.description
      return restaurant.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 搜尋 餐廳名字與類別
app.get('/search', (req, res) => {
  if (!req.query.keyword) {
    res.redirect('/')
  }
  const keyword = req.query.keyword.trim().toLocaleLowerCase()
  restDB.find()
    .lean()
    .then(allRestaurants => {
      const filteredRestaurants = allRestaurants.filter(restaurant => 
        restaurant.name.toLocaleLowerCase().includes(keyword)
        ||
        restaurant.category.toLocaleLowerCase().includes(keyword)
        ||
        restaurant.name_en.toLocaleLowerCase().includes(keyword)
        )
      res.render('index', { restaurants: filteredRestaurants })
    })
    .catch(err => console.log(err))
})

// 刪除餐廳
app.get('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  restDB.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// listen server
app.listen(port, () => {
  console.log(`express is running on http://localhost:${port}`)
})