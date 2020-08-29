var express = require('express');
var router = express.Router();
var models = require('../models');

// Get list of supports
router.get('/support', async function (req, res, next) {
  try {
    const supports = await models.Support.findAll(
      { attributes: ['name', 'email', 'contact', 'sourceLatitude', 'sourceLongitude', 'destinationLatitude', 'destinationLongitude'], include: [{ model: models.Location, as: 'source' }, { model: models.Location, as: 'destination' }] }
    );
    res.send(supports);
  } catch (e) {
    next(e);
  }
});
// Get list of requirements
router.get('/requirement', async function (req, res, next) {
  try {
    const requirements = await models.Requirement.findAll(
      { attributes: ['name', 'email', 'contact', 'sourceLatitude', 'sourceLongitude', 'destinationLatitude', 'destinationLongitude'], include: [{ model: models.Location, as: 'source' }, { model: models.Location, as: 'destination' }] }
    );
    res.send(requirements);
  } catch (e) {
    next(e);
  }
});

// Create new application for PPE
router.post('/support', async function (req, res, next) {
  try {

    const support = await models.Support.create({
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
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
    return res.render('thanks', { forId: support.id, forType: 'Support' });
  } catch (e) {
    next(e);
  }
});


module.exports = router;
