const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if (!req.headers.cookie) {
    models.Sessions.create().then(({insertId}) => {
      models.Sessions.get({id: insertId}).then(({hash}) => {
        req.session = {hash: hash};
        next();
      });
    });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

