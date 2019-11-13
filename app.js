// 載入框架、套件
const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// 設定連線至mongoDB，連線後回傳connection物件
mongoose.connect('mongodb://localhost/restaurants', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
// db連線異常
db.on('error', () => {
  console.log('mongodb error!')
})

// db連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// 載入Restaurant model
const Restaurant = require('./models/restaurant')

// 設定靜態資料夾
app.use(express.static('public'))

// 設定body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// 設定樣版引擎
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'main' }))
app.set('view engine', 'hbs')

// 設定路由
// restaurant首頁
app.get('/', (req, res) => {
  return res.redirect('/restaurants')
})

// 列出全部restaurant
app.get('/restaurants', (req, res) => {
  Restaurant.find((err, restaurants) => {
    if (err) return console.error(err)
    return res.render('index', { restaurants })
  })
})

// 新增一間restaurant頁面
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

// 新增一間restaurant
app.post('/restaurants', (req, res) => {
  // 建立Restaurant model的實例
  const restaurant = new Restaurant({
    name: req.body.name,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    google_map: req.body.google_map,
    phone: req.body.phone,
    rating: req.body.rating,
    description: req.body.description
  })
  // 存入資料庫
  restaurant.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')  //儲存完成後，導回首頁
  })
})

// 顯示一間restaurant的詳細資訊
app.get('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    return res.render('detail', { restaurant })
  })
})

// 修改restaurant頁面
app.get('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    return res.render('edit', { restaurant })
  })
})

// 修改restaurant
app.post('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    restaurant.name = req.body.name
    restaurant.category = req.body.category
    restaurant.image = req.body.image
    restaurant.location = req.body.location
    restaurant.google_map = req.body.google_map
    restaurant.phone = req.body.phone
    restaurant.rating = req.body.rating
    restaurant.description = req.body.description
    restaurant.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})

// 刪除restaurant
app.post('/restaurants/:id/delete', (req, res) => {
  res.send('刪除restaurant')
})

// 啟動並監聽伺服器
app.listen(3000, () => {
  console.log('App is running!')
})