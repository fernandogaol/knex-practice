const ShoppingService = require('../src/shopping-list-service');
const knex = require('knex');

describe(`Items service object`, function() {
  let db;
  let testItems = [
    {
      id: 1,
      name: 'First test item!',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      price: '12.00',
      category: 'Main',
      checked: false
    },
    {
      id: 2,
      name: 'Second test item!',
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      price: '21.00',
      category: 'Snack',
      checked: false
    },
    {
      id: 3,
      name: 'Third test item!',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      price: '3.00',
      category: 'Lunch',
      checked: false
    },
    {
      id: 4,
      name: 'Third test item!',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      price: '0.99',
      category: 'Breakfast',
      checked: false
    }
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => db('shopping_list').truncate());
  beforeEach(() => {
    return db.into('shopping_list').insert(testItems);
  });

  afterEach(() => db('shopping_list').truncate());
  // after(() => db.destroy()); // discard connection

  context(`Giving 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db.into('shopping_list').insert(testItems);
    });
  });
  it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
    // test that ShoppingService.getAllItems gets data from table
    return ShoppingService.getAllItems(db).then(actual => {
      expect(actual).to.eql(
        testItems.map(item => ({
          ...item,
          date_added: new Date(item.date_added)
        }))
      );
      context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
          return ShoppingService.getAllItems(db).then(actual => {
            expect(actual).to.eql([]);
          });
        });

        it(`insertItem() inserts a new item and resolves the new item with and 'id`, () => {
          const newItem = {
            name: 'Test new name',
            price: '2.05',
            category: 'Main',
            checked: false,
            date_added: new Date('2020-01-01T00:00:00.000Z')
          };
          return ShoppingService.insertItem(db, newItem).then(actual => {
            expect(actual).to.eql({
              id: 1,
              name: newItem.name,
              price: newItem.price,
              category: newItem.category,
              checked: newItem.checked,
              date_added: newItem.date_added
            });
          });
        });
        it(`getById() resolves an item by id from the 'shopping_list' table`, () => {
          const thirdId = 3;
          const thirdTestItem = testItems[thirdId - 1];
          return ShoppingService.getById(db, thirdId).then(actual => {
            expect(actual).to.eql({
              id: thirdId,
              name: thirdTestItem.name,
              price: thirdTestItem.price,
              category: thirdTestItem.category,
              checked: false,
              date_added: thirdTestItem.date_added
            });
          });
        });
        it(`deleteItem() removes an article by id from 'shopping_list' table`, () => {
          const itemId = 3;
          return ShoppingService.deleteItem(db, itemId)
            .then(() => ShoppingService.getAllItems(db))
            .then(allItems => {
              // copy the test items array without the removed article
              const expected = testItems
                .filter(article => article.id !== itemId)
                .map(item => ({
                  ...item,
                  checked: false
                }));
              expect(allItems).to.eql(expected);
            });
        });
        it(`updateItem() updates an article from the 'shopping_list' table`, () => {
          const idOfItemToUpdate = 3;
          const newItemData = {
            name: 'updated title',
            price: '99.99',
            date_added: new Date(),
            checked: true
          };
          const originalItem = testItems[idOfItemToUpdate - 1];
          return ShoppingService.updateItem(db, idOfItemToUpdate, newItemData)
            .then(() => ShoppingService.getById(db, idOfItemToUpdate))
            .then(article => {
              expect(article).to.eql({
                id: idOfItemToUpdate,
                ...originalItem,
                ...newItemData
              });
            });
        });
      });
    });
  });
});
