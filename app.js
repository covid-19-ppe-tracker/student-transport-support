'use strict';

var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var pino = require('express-pino-logger')();
var indexRouter = require('./routes/index');
const webpush = require('web-push');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const adminBroOptions = require('./admin/config');
const argon2 = require('argon2');
const models = require('./models');


const generateSecret = function () {
  return '' + Math.random() + Math.random() + Math.random();
}

let adminBro = new AdminBro(adminBroOptions);

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await models.User.findOne({
      where: {
        email,
        role: 'admin'
      }
    });
    if (user) {
      const matched = await argon2.verify(user.dataValues.password, password);
      if (matched) {
        return user;
      }
    }
    return false;
  },
  cookiePassword: generateSecret(),
})


const vapidKeys = {
  publicKey: fs.readFileSync("./server.pub").toString(),
  privateKey: fs.readFileSync('./server.priv').toString()
};

webpush.setVapidDetails(
  'mailto:web-push-book@gauntface.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
var app = express();
let sess = {
  secret: generateSecret(),
  resave: false,
  saveUninitialized: true,
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}

app.use(session(sess));
app.use(adminBro.options.rootPath, router);
app.set('view engine', 'ejs');
app.use(pino);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

module.exports = app;
