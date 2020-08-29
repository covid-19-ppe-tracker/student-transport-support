const webpush = require('web-push');
const fs = require('fs');
const vapidKeys = webpush.generateVAPIDKeys();

// Prints 2 URL Safe Base64 Encoded Strings
console.log("Public key:", vapidKeys.publicKey)
console.log("Private key", vapidKeys.privateKey);
fs.writeFile('server.pub', vapidKeys.publicKey, function(){
    fs.writeFile('server.priv', vapidKeys.privateKey, function(){
        console.log('VAPID keys have been written to file');
    });
});