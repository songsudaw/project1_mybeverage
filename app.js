const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const {
  formLogin,
  formSession,
  formSignup,
  createUser,
  drink,
  newDrink,
  saveDrink,
  drinkId,
  deleteDrink,
  editDrink,
  updateDrink,
  formSearch,
  category,
  newCategory,
  saveCategory,
  deleteCategory
} = require('./models/user_service')
const {connect} = require('./models/db')

connect()

const PORT = process.env.PORT || 3000

const app = express()

app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.static('public'))

const urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(urlencodedParser)
app.use(function(req, res, next) {
  if (req.query && typeof req.query && '_method' in req.query) {
    const method = req.query._method
    delete req.query._method
    req.method = method
    req.url = req.path
  }
  next()
})

app.get('/users/login', formLogin)
   .post('/users/session', urlencodedParser, formSession)
   .get('/users/signup', formSignup)
   .post('/users', urlencodedParser, createUser)
   .get('/drinks', drink)
   .post('/drinks', urlencodedParser, saveDrink)
   .get('/drinks/new', newDrink)
   .get('/drinks/:id', drinkId)
   .post('/drinks/search', urlencodedParser, formSearch)
   .delete('/drinks/:id', urlencodedParser, deleteDrink)
   .get('/drinks/:id/edit', editDrink)
   .put('/drinks/:id', urlencodedParser, updateDrink)
   .get('/categories', category)
   .get('/categories/new', newCategory)
   .post('/categories', urlencodedParser, saveCategory)
   .delete('/categories/:id', urlencodedParser, deleteCategory)

app.listen(PORT)
