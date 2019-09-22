const { redisClient } = require('./signin');

const authRequire = (req, res, next) => {
  const { authorization } = req.headers;
  const authToken = authorization.split('Bearer ')[1];
  if (!authToken) {
    return res.status(401).json('Unauthrized!');
  }

  redisClient.get(authToken, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unauthrized!');
    }
    next();
  });
};

module.exports = {
  authRequire
};
