// ./bin/bundle.js
const AdminBro = require('admin-bro');

// assume that you keep all your AdminBroOptions in this file
const adminBroOptions = require('../admin/config')

const admin = new AdminBro(adminBroOptions);
admin.initialize();
