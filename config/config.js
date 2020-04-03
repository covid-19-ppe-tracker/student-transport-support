module.exports = {
  development: {
    username: 'trackppe',
    password: 'trackppe',
    database: 'trackppe',
    host: 'localhost',
    dialect: 'postgres',
    // Use a different storage. Default: none
    seederStorage: 'sequelize', // or 'sequelize' to store in database
    gstorage_bucket: 'staging.covid-19-ppe-tracker.appspot.com'
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
    gstorage_bucket: 'gs://covid-19-ppe-tracker.appspot.com'
  }
};
