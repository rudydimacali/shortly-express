const _ = require('lodash');
const parseCookies = (req, res, next) => {
    // console.log(req);
    // console.log('\n\n', res)

    if (req.headers.cookie) {
        const cookieArr = req.headers.cookie.split(' ');
        _(cookieArr).each(cookie => {
            const keyVal = cookie.split('=');
            req.cookies[keyVal[0]] = keyVal[1].replace(/;/, '');
        })
    } else {
        req.cookies = {};
    }

    next()
};

module.exports = parseCookies;