"use strict";

var express = require("express");
const models = require("../models/");
const { check, validationResult } = require("express-validator");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const pino = require("pino")();
const nanoid = require("nanoid");
var router = express.Router();

/** Makes a URI for document uploads
*/
function make_uri(proof_kind, uri) {
  if (proof_kind == "document")
    return `${config.gstorage_bucket}/foo`;
  else if (proof_kind == "hyperlink")
    return uri;
  else
    return null;
}

// A common validate function for multiple routes
// https://express-validator.github.io/docs/running-imperatively.html
const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(422).json({ errors: errors.array() });
  };
};

// Create a proof document
router.post("/proofs/",
            validate([check("name").not().isEmpty(),
                      check("kind").isIn(models.Proof.rawAttributes.kind.values),
                      check("uri").if((value, {req}) => { return req.body.kind == "hyperlink";}).exists().withMessage("hyperlink must include a 'uri' parameter").isURL().withMessage("hyperlink 'uri' is an invalid URL"),
                     ]),
            async function (req, res, next) {
              try {
                // pino.info("in here baby");
                const proof = await models.Proof.create({
                  name: req.body.name,
                  kind: req.body.kind,
                  uri: make_uri(req.body.kind, req.body.uri),
                });
                res.json(proof);
              } catch (e) {
                if (e.name == "SequelizeUniqueConstraintError") {
                  //res.status(400).json(e);
                  req.log.error("nanoid created a conflicting ID!");
                  res.status(400).json({
                    msg: "please retry the document upload",
                    param: "uri",
                  });
                }
                else next(e);
              }
            });
module.exports = router;
