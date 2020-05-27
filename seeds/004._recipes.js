
exports.seed = function(knex) {
  return knex('users').select().then(users => {
    return knex('styles').select().then(styles => {
      return knex('recipes').insert([ 
        { name: 'Lagsagna', description: "Very nice lagsagna", prep_time: 30, approved: true, user_id: users.find(user => user.username === 'admin').id, style_id: styles.find(style => style.name === 'Italian').id },
        { name: 'Spaghetti', description: "Very nice spaghetti", prep_time: 60, user_id: users.find(user => user.username === 'admin').id, style_id: styles.find(style => style.name === 'Italian').id },
        { name: 'Carbonara', description: "Very nice Carbonara", prep_time: 90, approved: true, user_id: users.find(user => user.username === 'user').id, style_id: styles.find(style => style.name === 'Italian').id },
        { name: 'Pizza', description: "Very nice Pizza", prep_time: 120, user_id: users.find(user => user.username === 'user').id, style_id: styles.find(style => style.name === 'Italian').id },

        { name: 'Danish meal 1', description: "Very nice meal 1", prep_time: 30, user_id: users.find(user => user.username === 'admin').id, style_id: styles.find(style => style.name === 'Danish').id },
        { name: 'Danish meal 2', description: "Very nice meal 2", prep_time: 60, approved: true, user_id: users.find(user => user.username === 'admin').id, style_id: styles.find(style => style.name === 'Danish').id },
        { name: 'Danish meal 3', description: "Very nice meal 3", prep_time: 90, user_id: users.find(user => user.username === 'user').id, style_id: styles.find(style => style.name === 'Danish').id },
        { name: 'Danish meal 4', description: "Very nice meal 4", prep_time: 120, approved: true, user_id: users.find(user => user.username === 'user').id, style_id: styles.find(style => style.name === 'Danish').id },

        { name: 'French meal 1', description: "Very nice meal 1", prep_time: 30, user_id: users.find(user => user.username === 'admin').id, style_id: styles.find(style => style.name === 'French').id },
        { name: 'French meal 2', description: "Very nice meal 2", prep_time: 60, approved: true, user_id: users.find(user => user.username === 'admin').id, style_id: styles.find(style => style.name === 'French').id },
        { name: 'French meal 3', description: "Very nice meal 3", prep_time: 90, user_id: users.find(user => user.username === 'user').id, style_id: styles.find(style => style.name === 'French').id },
        { name: 'French meal 4', description: "Very nice meal 4", prep_time: 120, approved: true, user_id: users.find(user => user.username === 'user').id, style_id: styles.find(style => style.name === 'French').id },

        { name: 'Mexican meal 1', description: "Very nice meal 1", prep_time: 30, user_id: users.find(user => user.username === 'admin').id, style_id: styles.find(style => style.name === 'Mexican').id },
        { name: 'Mexican meal 2', description: "Very nice meal 2", prep_time: 60, approved: true, user_id: users.find(user => user.username === 'admin').id, style_id: styles.find(style => style.name === 'Mexican').id },
        { name: 'Mexican meal 3', description: "Very nice meal 3", prep_time: 90, user_id: users.find(user => user.username === 'user').id, style_id: styles.find(style => style.name === 'Mexican').id },
        { name: 'Mexican meal 4', description: "Very nice meal 4", prep_time: 120, approved: true, user_id: users.find(user => user.username === 'user').id, style_id: styles.find(style => style.name === 'Mexican').id },

        { name: 'Thai meal 1', description: "Very nice meal 1", prep_time: 30, user_id: users.find(user => user.username === 'admin').id, style_id: styles.find(style => style.name === 'Thai').id },
        { name: 'Thai meal 2', description: "Very nice meal 2", prep_time: 60, approved: true, user_id: users.find(user => user.username === 'admin').id, style_id: styles.find(style => style.name === 'Thai').id },
        { name: 'Thai meal 3', description: "Very nice meal 3", prep_time: 90, user_id: users.find(user => user.username === 'user').id, style_id: styles.find(style => style.name === 'Thai').id },
        { name: 'Thai meal 4', description: "Very nice meal 4", prep_time: 120, approved: true, user_id: users.find(user => user.username === 'user').id, style_id: styles.find(style => style.name === 'Thai').id },

        { name: 'Greek meal 1', description: "Very nice meal 1", prep_time: 30, user_id: users.find(user => user.username === 'admin').id, style_id: styles.find(style => style.name === 'Greek').id },
        { name: 'Greek meal 2', description: "Very nice meal 2", prep_time: 60, approved: true, user_id: users.find(user => user.username === 'admin').id, style_id: styles.find(style => style.name === 'Greek').id },
        { name: 'Greek meal 3', description: "Very nice meal 3", prep_time: 90, user_id: users.find(user => user.username === 'user').id, style_id: styles.find(style => style.name === 'Greek').id },
        { name: 'Greek meal 4', description: "Very nice meal 4", prep_time: 120, approved: true, user_id: users.find(user => user.username === 'user').id, style_id: styles.find(style => style.name === 'Greek').id },

        { name: 'American meal 1', description: "Very nice meal 1", prep_time: 30, user_id: users.find(user => user.username === 'admin').id, style_id: styles.find(style => style.name === 'American').id },
        { name: 'American meal 2', description: "Very nice meal 2", prep_time: 60, approved: true, user_id: users.find(user => user.username === 'admin').id, style_id: styles.find(style => style.name === 'American').id },
        { name: 'American meal 3', description: "Very nice meal 3", prep_time: 90, user_id: users.find(user => user.username === 'user').id, style_id: styles.find(style => style.name === 'American').id },
        { name: 'American meal 4', description: "Very nice meal 4", prep_time: 120, approved: true, user_id: users.find(user => user.username === 'user').id, style_id: styles.find(style => style.name === 'American').id },

        { name: 'Portuguese meal 1', description: "Very nice meal 1", prep_time: 30, user_id: users.find(user => user.username === 'admin').id, style_id: styles.find(style => style.name === 'Portuguese').id },
        { name: 'Portuguese meal 2', description: "Very nice meal 2", prep_time: 60, approved: true, user_id: users.find(user => user.username === 'admin').id, style_id: styles.find(style => style.name === 'Portuguese').id },
        { name: 'Portuguese meal 3', description: "Very nice meal 3", prep_time: 90, user_id: users.find(user => user.username === 'user').id, style_id: styles.find(style => style.name === 'Portuguese').id },
        { name: 'Portuguese meal 4', description: "Very nice meal 4", prep_time: 120, approved: true, user_id: users.find(user => user.username === 'user').id, style_id: styles.find(style => style.name === 'Portuguese').id },


      ]);
    });
  });
};
