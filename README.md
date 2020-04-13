# FindMeAMask

An application to track the availability and demand of PPE (Personal Protective
Equipment) to help people during the COVID-19 pandemic.

Live project link: https://covid-19-ppe-tracker.appspot.com/

## Getting Started
1. Copy `.env.example` to `.env`.
   We're using [dotenv](https://www.npmjs.com/package/dotenv) for resolving environment
   variables in development, via the .env file. Anything entered in .env will be loaded 
   as an environment variable in development mode. In production, we're relying on the 
   deployment-engine's environment resolution mechanism.
2. We're using Google Cloud Storage for document storage.
   Download the Google Application credential (JSON) file from a Service Account in
   [here](https://console.cloud.google.com/apis/credentials?project=covid-19-ppe-tracker).
   - Change the `.env` file if required, the `GOOGLE_APPLICATION_CREDENTIALS`
     should point to the credential file.
3. Run `docker-compose up -d` to launch the supporting Redis (port 6379) and a
   Postgres (port 5432) service instances :zap:
   Configuration for the Sequelize ORM is in `config/config.js`. If you're using the docker-compose
   file to start up Postgres then the default config will work. Otherwise, you will need to 
   provide the database credentials in `config/config.js`
4. Set up:
   ```
   npm install
   npm run generateKeys # This will generate VAPID keys needed by web-push 
   ```
5. Run the application on http://localhost:3000
   ```
   npm start:dev
   ```
6. Launch a browser after trusting `localhost:3000` as a secure origin. For
   example, running the following command will open a Google Chrome window which
   will trust `localhost:3000` as a secure website.
   ```
   google-chrome-stable --user-data-dir=/tmp/foo --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://localhost:3000
   ```

   This is required because web-push API only works with secure origins,
   i.e. with HTTPS sites. So, in order to run the app on localhost, we need to
   ask the browser to trust this domain as secure. Note that this will not work
   in production and you will have to configure a secure domain.

## Deployment
1. We are using adminBro for the admin panel which bundles custom user components
   into a file (`.adminbro/bundle.js`) at runtime. If the deployment service 
   doesn't allow writing to the file system, then custom components will not
   be loaded. So adminBro provides a convenience script to run before 
   deployment that bundles all components. 
   Generate it by executing `npm run bundle`.
   
## Contributing
Our DB schema is being maintained [here][dbschema].

[dbschema]: https://dbdesigner.page.link/2YFG3DgM3EjhmcUk9
