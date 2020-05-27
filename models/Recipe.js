const { Model } = require('objection');

const Style = require('./Style.js');
const User = require('./User.js');

class Recipe extends Model {
    static tableName = 'recipes';

    static relationMappings = {
        user: {
          relation: Model.BelongsToOneRelation,
          modelClass: User,
          join: {
            from: 'users.id',
            to: 'recipes.userId'
          }
        },
        style: {
            relation: Model.BelongsToOneRelation,
            modelClass: Style,
            join: {
              from: 'styles.id',
              to: 'recipes.styleId'
            }
          }
    };
}

module.exports = Recipe;