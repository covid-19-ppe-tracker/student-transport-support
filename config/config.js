module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'tracksts',
    password: process.env.DB_PASSWORD || 'tracksts',
    database: process.env.DB_NAME || 'tracksts',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    // Use a different storage. Default: none
    seederStorage: 'sequelize', // or 'sequelize' to store in database
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:"
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    dialect: 'postgres',
    seederStorage: 'sequelize', // or 'sequelize' to store in database
  }
};
