require('dotenv').config();

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: process.env.DB,
      user: process.env.USER,
      password: process.env.PW
    },
    migrations: {
        directory: './db/migrations',
    },
  },
};
