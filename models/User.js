const { Model } = require('objection');

const Role = require('./Role.js');
const Recipe = require('./Recipe.js');

class User extends Model {
    static tableName = 'users';

    static relationMappings = {
        role: {
          relation: Model.BelongsToOneRelation,
          modelClass: Role,
          join: {
            from: 'users.roleId',
            to: 'roles.id'
          }
        },
        recipe: {
          relation: Model.HasManyRelation,
          modelClass: Recipe,
          join: {
            from: 'users.id',
            to: 'recipes.userId'
          }
        }
    };
}

module.exports = User;