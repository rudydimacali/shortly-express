const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if (Object.keys(req.cookies).length === 0) {
    models.Sessions.create().then(({insertId}) => {
      models.Sessions.get({id: insertId}).then(({hash}) => {
        req.session = {hash: hash};
        res.cookies = {shortlyid : {value : hash}} 
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
        models.Sessions.create().then(({insertId})=> {
          models.Sessions.get({id : insertId}).then(({hash}) => {
            req.session = {hash : hash};
            res.cookies = {shortlyid : {value : hash}}
            next();
          })
        })
      }
    });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

