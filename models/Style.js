const { Model } = require('objection');

const Recipe = require('./Recipe.js');

class Style extends Model {
    static tableName = 'styles';

    static relationMappings = {
        recipe: {
          relation: Model.HasOneRelation,
          modelClass: Recipe,
          join: {
            from: 'styles.id',
            to: 'recipes.styleId'
          }
        }
    };
}

module.exports = Style;