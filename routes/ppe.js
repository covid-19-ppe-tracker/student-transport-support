var express = require('express');
var router = express.Router();
var models = require('../models');
const { upload, validate, makeURI } = require('./utils');
const webpush = require('web-push');
const redis = require("redis");
const client = redis.createClient(
  process.env.REDIS_PORT || '6379',
  process.env.REDIS_HOST || '127.0.0.1',
  {
    'auth_pass': process.env.REDIS_KEY,
    'return_buffers': true
  });
const searchRadius = 10; //km
const { check } = require("express-validator");

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
  try {
    const availabilities = await models.Availability.findAll({ include: models.PPEType });
    const requirements = await models.Requirement.findAll({ include: models.PPEType });
    const manufacturings = await models.Manufacturing.findAll({ include: models.PPEType });
    res.render('ppe-list', { availabilities: availabilities, requirements: requirements, manufacturing: manufacturings });
  }
  catch (e) {
    next(e)
  }
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
      const proof = await models.Proof.create();
      const document = await models.Document.create({
        kind: req.body.kind,
        uri: makeURI(req.body.kind, req.body.uri, req.file),
        ProofId: proof.id
      });
      let record = {
        name: req.body.name,
        PPETypeId: req.body.PPETypeId,
        quantity: req.body.quantity,
        email: req.body.email,
        contact: req.body.contact,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        ProofId: proof.id
      }
      if (req.body.mode === 'availability') {
        const availability = await models.Availability.create(record);
        findMatches(availability, 'Availability', 'onCreate');
        return res.render('ppe-thanks', { forId: availability.id, forType: 'Availability' });
      }
      else if (req.body.mode === 'requirement') {
        record.canBuy = req.body.canBuy;
        const requirement = await models.Requirement.create(record);
        findMatches(requirement, 'Requirement', 'onCreate');
        return res.render('ppe-thanks', { forId: requirement.id, forType: 'Requirement' });
      }
      else if (req.body.mode === 'manufacturing') {
        record.remarks = req.body.remarks;
        const manufacturing = await models.Manufacturing.create(record);
        return res.redirect('/ppe/map');
      }
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
