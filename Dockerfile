FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

ARG port=8080
ENV NODE_ENV=production \
    PORT=$port \
    DB_HOST=postgres \
    DB_PORT=5432 \
    DB_USERNAME=tracksts \
    DB_PASSWORD=tracksts \
    DB_NAME=tracksts

EXPOSE $port

CMD [ "npm", "start" ]
