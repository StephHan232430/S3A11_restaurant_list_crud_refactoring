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

// 設定首頁路由
app.get('/', (req, res) => {
  res.render('index')
})

// 啟動並監聽伺服器
app.listen(3000, () => {
  console.log('App is running!')
})