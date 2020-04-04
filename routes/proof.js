"use strict";

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];

const express = require("express");
const models = require("../models/");
const multer = require('multer');
const { nanoid } = require("nanoid");
const pino = require("pino")();
const router = express.Router();
const multerGoogleStorage = require("multer-google-storage");
const { check, validationResult } = require("express-validator");

/** Makes a URI for document uploads
 */
function makeURI(proofKind, uri, file) {
  if (proofKind == "document")
    return file.filename;
  else if (proofKind == "hyperlink")
    return uri;
  else
    return null;
}

/** Uploads to google cloud storage with custom filename.
 *
 * filename == proofs/<14-letter-hash>_<original-name>.<original-ext>
 */
const upload = multer({
  storage: multerGoogleStorage.storageEngine({
    filename: (_req, file, cb) => { cb(null, `proofs/${nanoid(14)}-${file.originalname}`); }
  }),
  fileFilter: (req, _file, cb) => {
    if (req.body.kind == 'document')
      cb(null, true);
    else
      cb(null, false);
  }
});


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
            upload.single('document'),
            validate([check("name").not().isEmpty(),
                      check("kind").isIn(models.Proof.rawAttributes.kind.values),
                      check("uri", "hyperlink 'uri' must be present and conform to a URL").if((value, {req}) => { return req.body.kind == "hyperlink";}).exists().isURL()
                     ]),
            async function (req, res, next) {
              try {
                const proof = await models.Proof.create({
                  name: req.body.name,
                  kind: req.body.kind,
                  uri: makeURI(req.body.kind, req.body.uri, req.file),
                });
                res.json(proof);
              } catch (e) {
                next(e);
              }
            });
module.exports = router;
