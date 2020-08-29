# Student Transport Support Tracker

An application to track support for students to help them reach their exam centres.
An initiative by IIT Bombay.


## Getting Started
1. Copy `.env.example` to `.env`.
   We're using [dotenv](https://www.npmjs.com/package/dotenv) for resolving environment
   variables in development, via the .env file. Anything entered in .env will be loaded 
   as an environment variable in development mode. In production, we're relying on the 
   deployment-engine's environment resolution mechanism.
   - Default database credentials are in `config/config.js`. Please do not modify this 
   file. If you need to override the credentials, simply insert the environment variables
   `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST` into the .env file.
   - Default mailer configuration is in `config/mailer.js`. If no `EMAIL_HOST` environment
   variable is provided, it will automatically create an [Ethereal](https://ethereal.email/)
   account to be used as a fake smtp server. For sending proper mails, please provide the
   `EMAIL` environment variables as shown in `.env.example`.

3. Run `docker-compose up -d` to launch the supporting Redis (port 6379) and a
   Postgres (port 5432) service instances :zap:
   Configuration for the Sequelize ORM is in `config/config.js`. If you're using the docker-compose
   file to start up Postgres then the default config will work. Otherwise, you will need to 
   provide the database credentials in `config/config.js`
4. Set up:
   ```
   npm install
   npm run migrate
   npm run seed
   ```
5. Run the application on http://localhost:3000
   ```
   npm start:dev
   ```

## Deployment
1. We are using adminBro for the admin panel which bundles custom user components
   into a file (`.adminbro/bundle.js`) at runtime. If the deployment service 
   doesn't allow writing to the file system, then custom components will not
   be loaded. So adminBro provides a convenience script to run before 
   deployment that bundles all components. 
   Generate it by executing `npm run bundle`.
   