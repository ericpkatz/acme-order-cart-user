const conn = require('./conn');

const User = conn.define('user', {
  id: {
    type: conn.Sequelize.UUID,
    defaultValue: conn.Sequelize.UUIDV4,
    primaryKey: true
  },
  name: conn.Sequelize.STRING,
  password: conn.Sequelize.STRING
});

module.exports = User;
