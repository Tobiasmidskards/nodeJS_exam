
exports.up = function(knex) {
    return knex.schema
    .createTable('styles', (table) => {
        table.increments('id').notNullable();
        table.string('name').unique().notNullable();
    })
    .createTable('recipes', (table) => {
        table.increments('id').notNullable();
        table.string('name').notNullable();

        table.text('description').notNullable();
        table.string('link').notNullable().defaultTo('https://www.arla.dk/opskrifter/');
        table.integer('likes').notNullable().defaultTo(0);
        table.boolean('approved').notNullable().defaultTo(false);

        table.integer('prep_time').notNullable();

        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('users.id');

        table.integer('style_id').unsigned().notNullable();
        table.foreign('style_id').references('styles.id');

        table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
        table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('styles')
    .dropTableIfExists('recipes')
};
