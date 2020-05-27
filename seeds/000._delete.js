
exports.seed = function(knex) {
  return knex('users').del()
    .then(() => {
      return knex('roles').del();
    })
    .then(() => {
      return knex('styles').del();
    })
    .then(() => {
      return knex('recipes').del();
    });
};
