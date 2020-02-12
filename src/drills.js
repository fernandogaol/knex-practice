require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

function searchTermByText(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}

// searchTermByText('Facon');

function pageNumber(page) {
  const productsPerPage = 6;
  const offset = productsPerPage * (page - 1);
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
}

// pageNumber(2);

function daysAgo(days) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
    )

    .groupBy('id')
    .then(results => {
      console.log('PRODUCTS ADDED DAYS AGO');
      console.log(results);
    });
}

// daysAgo(2);

function costPerCategory() {
  knexInstance
    .select('category')
    .sum('price as total_per_category')
    .from('shopping_list')
    .groupBy('category')
    .then(result => {
      console.log(result);
    });
}

costPerCategory();
