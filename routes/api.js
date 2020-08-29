var express = require('express');
var router = express.Router();
var models = require('../models');


// Get list of locations
router.get('/location', async function (req, res, next) {
  try {
    const locations = await models.Location.findAll(
      { attributes: ['id', 'name'], include: [{ model: models.Location, as: 'isLocatedIn' }] }
    );
    res.send(locations);
  } catch (e) {
    next(e);
  }
});
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



module.exports = router;
