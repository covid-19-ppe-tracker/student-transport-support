"use strict";
const gcs_uri_root = 'https://storage.cloud.google.com/documents.ppecovid.in'

const multer = require('multer');
const { nanoid } = require("nanoid");
const multerGoogleStorage = require("multer-google-storage");
const {  validationResult } = require("express-validator");
const utils = {
  /** Makes a URI for document uploads
 */
  makeURI: function (documentKind, uri, file) {
    if (documentKind == "file")
      return gcs_uri_root + file.filename;
    else if (documentKind == "hyperlink")
      return uri;
    else
      return null;
  },
  /** Uploads to google cloud storage with custom filename.
 *
 * filename == proofs/<14-letter-hash>_<original-name>.<original-ext>
 */
  upload: multer({
    storage: multerGoogleStorage.storageEngine({
      acl: {},
      filename: (_req, file, cb) => { cb(null, `/proofs/${nanoid(14)}-${file.originalname}`); }
    }),
    fileFilter: (req, _file, cb) => {
      if (req.body.kind == 'file')
        cb(null, true);
      else
        cb(null, false);
    }
  }),


  // A common validate function for multiple routes
  // https://express-validator.github.io/docs/running-imperatively.html
  validate: validations => {
    return async (req, res, next) => {
      await Promise.all(validations.map(validation => validation.run(req)));
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      res.status(422).json({ errors: errors.array() });
    };
  }
}

module.exports = utils;

