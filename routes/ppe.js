// Dependencies
const request = require('request')
const { check } = require("express-validator");
const { upload, validate, makeURI } = require('./utils');
const webpush = require('web-push');
const nanoid = require('nanoid').nanoid;
const redis = require("redis");
const argon2 = require('argon2');
const nodemailer = require("nodemailer");
// App
var express = require('express');
var router = express.Router();
var models = require('../models');
// Configs
const INCOMING_WEBHOOK = process.env.INCOMING_WEBHOOK
const client = redis.createClient(
  process.env.REDIS_PORT || '6379',
  process.env.REDIS_HOST || '127.0.0.1',
  {
    'auth_pass': process.env.REDIS_KEY,
    'return_buffers': true
  });
const searchRadius = 10; //km

client.on("error", function (error) {
  console.error(error);
});
client.on("connect", function (res) {
  console.log("connected to redis instance");
});


/*********************************************
 ****************** Getters ******************
 *********************************************/

// View ppe on map
router.get('/map', function (req, res, next) {
  res.render('ppe-map', { lat: req.query.lat || 22, lng: req.query.lng || 84, zoom: req.query.zoom || 4.5 });
});
// View ppe as list
router.get('/list', async function (req, res, next) {
  ap = models.Availability.findAll({ include: [models.PPEType, models.User], order:[['createdAt', 'DESC']] });
  rp = models.Requirement.findAll({ include: [models.PPEType, models.User], order:[['createdAt', 'DESC']] });
  mp = models.Manufacturing.findAll({ include: [models.PPEType, models.User], order:[['createdAt', 'DESC']] });
  Promise.all([ap, rp, mp]).then(function (response) {
    res.render('ppe-list', { availabilities: response[0], requirements: response[1], manufacturing: response[2] });
  }).catch(e => next(e));
});

// View ppe-create form
router.get('/create', async function (req, res, next) {
  try {
    const PPETypes = await models.PPEType.findAll();
    res.render('ppe-create', { PPETypes: PPETypes });
  } catch (e) {
    next(e);
  }
});


/*********************************************
 ****************** Setters ******************
 *********************************************/

// Create new application for PPE
router.post('/',
  upload.single('file'),
  validate([
    // check("name").not().isEmpty(),
    check("kind").isIn(models.Document.rawAttributes.kind.values),
    check("uri", "hyperlink 'uri' must be present and conform to a URL").if((value, { req }) => { return req.body.kind == "hyperlink"; }).exists().isURL()
  ]),
  async function (req, res, next) {
    try {
      let transporter = await require('../config/mailer')
      const proof = await models.Proof.create();
      const document = await models.Document.create({
        kind: req.body.kind,
        uri: makeURI(req.body.kind, req.body.uri, req.file),
        ProofId: proof.id
      });
      const [user, created] = await models.User.findOrCreate({
        where: { email: req.body.email },
        defaults: {
          username: req.body.name,
          role: 'Applicant',
          contact: req.body.contact,
          password: await argon2.hash(req.body.name),
          createdAt: new Date(),
          updatedAt: new Date(),
          token: nanoid(50)
        }
      });
      // send mail with defined transport object
      const statusLink = `${process.env.BASE_URL || 'http://localhost:3000/'}user/${user.token}`;
      let info = transporter.sendMail({
        from: process.env.EMAIL_SENDER || 'PPE Tracker', // sender address
        to: user.email, // list of receivers
        subject: "Your PPE Application", // Subject line
        text: `Your application was registered successfully. Please open this link to view your application status: ${statusLink}`, // plain text body
        html: `
          <h1>Your application was registered successfully</h1>
          <p>Please click on this link to view your application status</p>
          <a href="${statusLink}" target="_blank">${statusLink}</a>
          `
      }).then(() => {
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...  
      });

      console.log("USER: " + user.id)
      let records = [];
      for (var i = 0; i < req.body.PPETypeId.length; i++) {
        records.push({
          name: req.body.name,
          PPETypeId: req.body.PPETypeId[i],
          quantity: req.body.quantity[i],
          email: req.body.email,
          contact: req.body.contact,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          ProofId: proof.id,
          UserId: user.id
        })
      }

      request.post(
        INCOMING_WEBHOOK,
        {
          json: {
            text: `A new ${req.body.mode} was generated`
          }
        },
        (error, res, body) => {
          if (error) {
            console.error(error)
            return
          }
          console.log(`statusCode: ${res.statusCode}`)
          console.log(body)
        }
      )
      let createdRecords;
      switch (req.body.mode) {
        case 'Availability': {
          createdRecords = await models.Availability.bulkCreate(records);
          break;
        }
        case 'Requirement': {
          for (let r of records) {
            r.canBuy = req.body.canBuy;
          }
          createdRecords = await models.Requirement.bulkCreate(records);
          break;
        }
        case 'Manufacturing': {
          for (let r of records) {
            r.remarks = req.body.remarks;
          }
          createdRecords = await models.Manufacturing.bulkCreate(records);
          break;
        }
      }          
      // findMatches(requirement, 'Requirement', 'onCreate');
      return res.render('ppe-thanks', { forId: createdRecords[0].id, forType: req.body.mode, statusLink });
    } catch (e) {
      next(e);
    }
  });


// Create a subscription for push notification
router.post('/save-subscription/', async function (req, res) {
  try {
    const sub = await models.Subscription.create({
      forId: req.body.forId,
      forType: req.body.forType,
      pushSubscription: req.body.pushSubscription
    });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ data: { success: true } }));
    const application = await models[req.body.forType].findOne({ where: { id: req.body.forId } })
    findMatches(application, req.body.forType, 'onSubscribe');

  } catch (e) {
    res.status(500);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: {
        id: 'unable-to-save-subscription',
        message: 'The subscription was received but we were unable to save it to our database.'
      }
    }));
  }
});



/*********************************************
 ************** Helper Functions *************
 *********************************************/
function findMatches(newPost, newPostType, mode) {
  let searchType;
  if (newPostType === 'Availability') {
    searchType = 'Requirement';
  }
  else {
    searchType = 'Availability';
  }
  client.geoadd(newPostType, newPost.longitude, newPost.latitude, newPost.id + '.' + newPost.PPETypeId, function (err, res) {
    // console.log(err,res);
    if (!err) {
      client.georadius(searchType, newPost.longitude, newPost.latitude, searchRadius, "km", 'WITHCOORD', function (err, res) {
        for (let match of res) {

          let matchId = match[0].toString().split('.')[0];
          let PPETypeId = match[0].toString().split('.')[1];
          if (PPETypeId === newPost.PPETypeId) {
            // mode can be onSubscribe or onCreate
            if (mode === 'onSubscribe') {
              sendMessage(newPost.id, newPostType, { lat: newPost.latitude, lng: newPost.longitude });
              return;
            }
            sendMessage(matchId, searchType, { lat: match[1][1].toString(), lng: match[1][0].toString() });
          }
        }
      })
    }
  });
}

const triggerPushMsg = function (subscription, dataToSend) {
  return webpush.sendNotification(subscription, dataToSend)
    .catch((err) => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        console.log('Subscription has expired or is no longer valid: ', err);
        return deleteSubscriptionFromDatabase(subscription._id);
      } else {
        throw err;
      }
    });
};

function sendMessage(recipientId, recipientType, coords) {
  console.log("Sending message to ", recipientId, recipientType)
  models.Subscription.findOne({ where: { forId: recipientId, forType: recipientType } })
    .then(function (subscription) {
      if (!subscription) {
        return;
      }
      let promiseChain = Promise.resolve();

      promiseChain = promiseChain.then(() => {
        let payload = { title: "COVID-19 PPE Tracker", message: "We found a match", coords: coords };

        return triggerPushMsg(JSON.parse(subscription.pushSubscription), JSON.stringify(payload));
      });
      return promiseChain;
    })
}



module.exports = router;
