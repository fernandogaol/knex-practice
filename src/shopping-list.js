require('dotenv').config();
const knex = require('knex');
const ShoppingService = require('./shopping-list-service');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.TEST_DB_URL
});

console.log(ShoppingService.getAllItems(knexInstance));

// use all the ArticlesService methods!!
ShoppingService.getAllItems(knexInstance)
  .then(item => console.log(item))
  .then(() =>
    ShoppingService.insertItem(knexInstance, {
      name: 'New title',
      price: '2.05',
      category: 'Main',
      checked: false,
      date_added: new Date()
    })
  )
  .then(newItem => {
    console.log(newItem);
    return ShoppingService.updateItem(knexInstance, newItem.id, {
      name: 'Updated title'
    }).then(() => ShoppingService.getById(knexInstance, newItem.id));
  })
  .then(item => {
    console.log(item);
    return ShoppingService.deleteItem(knexInstance, item.id);
  });
