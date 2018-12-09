const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if (!req.cookies || Object.keys(req.cookies).length === 0) {
    models.Sessions.create().then(({insertId}) => {
      models.Sessions.get({id: insertId}).then(({hash}) => {
        req.session = {hash: hash};
        res.cookie('shortlyid', hash);
        res.setHeader('Set-Cookie', `shortlyid=${hash}`);
        next();
      });
    });
  } else {
    const cookie = req.cookies.shortlyid;
    req.session = {hash : cookie};
    models.Sessions.get({hash : cookie}).then((result) => {
      if (result) {
        req.session.user = result.user;
        req.session.userId = result.userId;
        next();
      } else {
        models.Sessions.create()
          .then(({insertId})=> {
            models.Sessions.get({id : insertId}).then(({hash}) => {
              req.session = {hash: hash};
              res.cookie('shortlyid', hash);
              next();
            });
          });
      }
    });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

// VERIFY
module.exports.verifyUser = (req, res, next) => {
  if (!models.Sessions.isLoggedIn(req.session)) {
    res.redirect('/login');
  } else {
    next();
  }
};
