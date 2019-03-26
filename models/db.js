const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://localhost:5432/mybeverage') 

const connect = async function(){
    try{
        await sequelize.authenticate()
        // await sequelize.sync({force: true})
        console.log('Connected to database!')
    }catch (e){
      console.log('Cannot connect to database!')
    }
}

const Users = function(sequelize, type){
    return sequelize.define('users', {
      username: {
        type: type.STRING,
        unique: true
      },
      password: type.STRING
    })
}
  
const Categories = function(sequelize, type){
  return sequelize.define('categories', {
    name: {
      type: type.STRING,
      unique: true
    }
  })
}

const Drinks = function(sequelize, type){
    return sequelize.define('drinks', {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: type.STRING,
      imageUrl: type.STRING,
      comment: type.STRING,
      username: type.STRING,
      category: type.STRING
  })
}

module.exports = {
    connect,
    UsersModel: Users(sequelize, Sequelize),
    CategoriesModel: Categories(sequelize, Sequelize),
    DrinksModel: Drinks(sequelize, Sequelize)
}