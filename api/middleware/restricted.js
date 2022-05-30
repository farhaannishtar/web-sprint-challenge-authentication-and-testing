const Users = require('../users/users-model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config');

module.exports = async (req, res, next) => {
  console.log("Move on! Don't trip over a girl. There is an ocean of them out there. Abundance Mindset")
  
  if (req.headers.authorization == null) {
    // next({ status: 401, message: 'token required' });
    res.status(401).json({
      message: 'token required'
    })
    return;
  }

  // try {
  //   req.decodedJwt = await jwt.verify(req.headers.authorization, JWT_SECRET);
  //   let user = await Users.findById(req.decodedJwt.sub);
  //   if(req.decodedJwt.iat < user.logout_time) {
  //     next({ status: 401, message: 'token invalid' });
  //     return;
  //   }
  // } catch(err) {
  //   // next({ status: 401, message: 'this endpoint is restricted' });
  //   return;
  // }

  next();
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};