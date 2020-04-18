var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/ppe/map')
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
