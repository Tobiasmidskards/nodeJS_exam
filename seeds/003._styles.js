
exports.seed = function(knex) {
  // Inserts seed entries
  return knex('styles').insert([
    { name: 'Italian' },
    { name: 'American' },
    { name: 'Danish' },
    { name: 'French' },
    { name: 'Portuguese' },
    { name: 'Mexican' },
    { name: 'Thai' },
    { name: 'Greek' }
  ]);
};
