var express = require('express');
var router = express.Router();
var models = require('../models');

// Get list of availabilities
router.get('/availability', async function (req, res, next) {
  try {
    const availabilities = await models.Availability.findAll(
      { attributes: ['name', 'quantity', 'latitude', 'longitude'], include: models.PPEType }
    );
    res.send(availabilities);
  } catch (e) {
    next(e);
  }
});
// Get list of requirements
router.get('/requirement', async function (req, res, next) {
  try {
    const requirements = await models.Requirement.findAll(
      { attributes: ['name', 'quantity', 'latitude', 'longitude'], include: models.PPEType }
    );
    res.send(requirements);
  } catch (e) {
    next(e);
  }
});
// Get list of manufacturings
router.get('/manufacturing', async function (req, res, next) {
  try {
    const manufacturings = await models.Manufacturing.findAll(
      { attributes: ['name', 'quantity', 'latitude', 'longitude'], include: models.PPEType }
    );
    res.send(manufacturings);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
