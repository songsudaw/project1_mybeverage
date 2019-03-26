const {UsersModel, CategoriesModel, DrinksModel} = require('../models/db')
let username = ''

module.exports = {
  formLogin: function(req, res) {
    console.log('formLogin')
    res.setHeader("Conetent-Type", 'text/html')
    res.render('users/login')
  },
  formSession: async function(req, res) {
    console.log('formSession')
    const {username, password} = req.body
    console.log(`formSession username, password : ${username}, ${password}`)
    res.setHeader("Conetent-Type", 'text/html')
    if (username && password){
      //verify user password
      try {
        const user = await UsersModel.findOne({
          where: {
            username,
            password
          }
        })
        if (user && (typeof(user) !== undefined)){
          this.username = user.username
          const drinksList = await DrinksModel.findAll({})
          res.render('drinks/drink', {drinksList})
        }else{
          const error = 'Invalid User or Password'
          res.render('users/login', {error})
        }
      }catch (e){
        res.render('users/login', {error: e})
      }
    }else{
      const error = 'User or Password is null value'
      res.render('users/login', {error})
    }
  },
  formSignup: function(req, res) {
    console.log('formSignup')
    res.setHeader("Conetent-Type", 'text/html')
    res.render('users/signup')
  },
  createUser: async function(req, res) {
    console.log('createUser')
    const {username, password} = req.body
    console.log(`createUser username, password : ${username}, ${password}`)
    res.setHeader("Conetent-Type", 'text/html')
    let msg = 'initial message'
    try{
      await UsersModel.create({username, password})
      msg = 'Create user completed'
    }catch (e){
      console.error(e)
      msg = `Cannot create user [${e}]`
    }
    res.render('users/login', {error: msg})
  },
  newDrink: async function(req, res) {
    console.log('newDrink')
    const categoriesList = await CategoriesModel.findAll({})
    res.setHeader("Conetent-Type", 'text/html')
    res.render('drinks/new_drink', {categoriesList, username: this.username})
  },
  drink: async function(req, res) {
    console.log('drink')
    const drinksList = await DrinksModel.findAll({})
    res.setHeader("Conetent-Type", 'text/html')
    res.render('drinks/drink', {drinksList})
  },
  saveDrink: async function(req, res) {
    console.log('saveDrink')
    const {drink_name, image_url, comment, username, select_cat} = req.body
    res.setHeader("Conetent-Type", 'text/html')
    let msg = 'initial message'
    try{
      await DrinksModel.create({
        name: drink_name,
        imageUrl: image_url,
        comment: comment,
        username: username,
        category: select_cat
      })
      msg = 'Create drink completed'
    }catch (e){
      console.error(e)
      msg = `Cannot create drink [${e}]`
    }
    const drinksList = await DrinksModel.findAll({})
    res.render('drinks/drink', {drinksList, error: msg})
  },
  drinkId: async function(req, res) {
    console.log('drinkId')
    const {id} = req.params
    console.log(`drink_id: ${id}`)
    const drink = await DrinksModel.findByPk(id)
    console.log(`drink: ${JSON.stringify(drink)}`)
    res.setHeader("Conetent-Type", 'text/html')
    res.render('drinks/drink_id', {drink})
  },
  deleteDrink: async function(req, res) {
    console.log('deleteDrink')
    let msg = 'initial message'
    try{
      const drink_id = req.params.id
      console.log(`deleteDrink drink_id = ${drink_id}`)
      res.setHeader("Conetent-Type", 'text/html')
      await DrinksModel.destroy({where: {id: drink_id}})
      msg = 'Delete drink completed'
    }catch (e){
      console.error(e)
      msg = `Cannot delete drink [${e}]`
    }
    const drinksList = await DrinksModel.findAll({})
    res.render('drinks/drink', {drinksList, error: msg})
  },
  editDrink: async function(req, res) {
    const drink_id = req.params.id
    const drink = await DrinksModel.findByPk(drink_id)
    const categoriesList = await CategoriesModel.findAll({})
    res.render('drinks/edit_drink', {drink, categoriesList, username: this.username})
  },
  updateDrink: async function(req, res) {
    console.log('updateDrink')
    const drink_id = req.params.id
    const {drink_name, image_url, comment, username, select_cat} = req.body
    res.setHeader("Conetent-Type", 'text/html')
    let msg = 'initial message'
    try{
      await DrinksModel.update(
        {
          tname: drink_name,
          imageUrl: image_url,
          comment: comment,
          username: username,
          category: select_cat
        }, 
        {where: {id: drink_id}})
      msg = 'Update drink completed'
    }catch (e){
      console.error(e)
      msg = `Cannot update drink [${e}]`
    }
    const drinksList = await DrinksModel.findAll({})
    res.render('drinks/drink', {drinksList, error: msg})
  },
  formSearch: async function(req, res) {
    console.log('formSearch')
    const {drink_name} = req.body
    let error = 'initial message'
    let drinksList
    if (!drink_name || (typeof(drink_name) === undefined)){
      drinksList = await DrinksModel.findAll({})
      if (drinksList && drinksList.length > 0){
        error = null
      }else{
        error = 'Drink not found'
      }
    }else{
      drinksList = await DrinksModel.findAll({ where: {name: drink_name } })
      if (drinksList && drinksList.length > 0){
        error = null
      }else{
        error = 'Drink not found'
      }
    }
    res.setHeader("Conetent-Type", 'text/html')
    res.render('drinks/drink', {drinksList, error})
  },
  category: async function(req, res) {
    console.log('category')
    const categoriesList = await CategoriesModel.findAll({})
    res.setHeader("Conetent-Type", 'text/html')
    res.render('categories/category', {categoriesList})
  },
  newCategory: function(req, res) {
    console.log('newCategory')
    res.setHeader("Conetent-Type", 'text/html')
    res.render('categories/new_category')
  },
  saveCategory: async function(req, res) {
    console.log('saveCategory')
    const {category_name} = req.body
    console.log(`saveCategory category name : ${category_name}`)
    res.setHeader("Conetent-Type", 'text/html')
    let msg = 'initial message'
    try{
      await CategoriesModel.create({name: category_name})
      msg = 'Create category completed'
    }catch (e){
      console.error(e)
      msg = `Cannot create category [${e}]`
    }
    const categoriesList = await CategoriesModel.findAll({})
    res.render('categories/category', {categoriesList, error: msg})
  },
  deleteCategory: async function(req, res) {
    console.log('deleteCategory')
    let msg = 'initial message'
    try{
      const category_name = req.params.id
      console.log(`deleteCategory name_id = ${category_name}`)
      res.setHeader("Conetent-Type", 'text/html')
      await CategoriesModel.destroy({where: {name: category_name}})
      msg = 'Delete category completed'
    }catch (e){
      console.error(e)
      msg = `Cannot delete category [${e}]`
    }
    const categoriesList = await CategoriesModel.findAll({})
    res.render('categories/category', {categoriesList, error: msg})
  }
  
}
