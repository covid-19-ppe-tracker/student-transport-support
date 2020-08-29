var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/map')
});


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

// View create support form
router.get('/create/support', async function (req, res, next) {
  try {
    const locations = await models.Location.findAll();
    res.render('create-support', { locations: locations });
  } catch (e) {
    next(e);
  }
});

// View create requirement form
router.get('/create/requirement', async function (req, res, next) {
  try {
    const locations = await models.Location.findAll();
    res.render('create-requirement', { locations: locations });
  } catch (e) {
    next(e);
  }
});

// Create new application for support
router.post('/support', async function (req, res, next) {
  try {
    console.log("Creating support")
    console.log(req.body);
    const support = await models.Support.create({
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      travelDate: new Date(req.body.travelDate),
      sourceId: req.body.sourceId,
      sourceLatitude: req.body.sourceLatitude,
      sourceLongitude: req.body.sourceLongitude,

      destinationId: req.body.destinationId,
      destinationLatitude: req.body.destinationLatitude,
      destinationLongitude: req.body.destinationLongitude,
      remarks: req.body.remarks,
      resolved: false
    })

    // findMatches(requirement, 'Requirement', 'onCreate');
    return res.render('thanks', { forId: support.id, forType: 'support' });
  } catch (e) {
    next(e);
  }
});


// Create new application for requirement
router.post('/requirement', async function (req, res, next) {
  try {
    console.log("Creating requirement")
    console.log(req.body);
    const requirement = await models.Requirement.create({
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      travelDate: new Date(req.body.travelDate),
      sourceId: req.body.sourceId,
      sourceLatitude: req.body.sourceLatitude,
      sourceLongitude: req.body.sourceLongitude,

      destinationId: req.body.destinationId,
      destinationLatitude: req.body.destinationLatitude,
      destinationLongitude: req.body.destinationLongitude,
      remarks: req.body.remarks,
      resolved: false
    })

    // findMatches(requirement, 'Requirement', 'onCreate');
    return res.render('thanks', { forId: requirement.id, forType: 'requirement' });
  } catch (e) {
    next(e);
  }
});

// View contact-us information
router.get('/contact-us', function (req, res, next) {
  res.render('contact-us');
});
router.post('/suggestion', async function (req, res, next) {
  try {
    await models.Suggestion.create({
      text: req.body.suggestion
    });
    res.render('contact-us', { alert: true });
  } catch (e) {
    next(e);
  }
})




module.exports = router;
