var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/:token', async function (req, res, next) {
  try {
    const user = await models.User.findOne(
      {
        attributes: ['id', 'username', 'email', 'contact', 'verified', 'token'],
        where: {token: req.params.token, role: 'Applicant'}
      }
    );
    if(!user){
      res.send("No such user")
    }
    const availabilities = await models.Availability.findAll({where: {UserId:user.id}, include: [models.PPEType, models.Proof] });
    const requirements = await models.Requirement.findAll({where: {UserId:user.id}, include: [models.PPEType, models.Proof] });
    const manufacturings = await models.Manufacturing.findAll({where: {UserId:user.id}, include: [models.PPEType, models.Proof] });
    res.render('user', { user: user, availabilities: availabilities, requirements: requirements, manufacturing: manufacturings });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
