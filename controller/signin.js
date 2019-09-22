const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient({ host: '127.0.0.1' });

const signinHandller = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject({ error: 'information is not valid' });
  }
  return db
    .select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      if (!data.length) {
        return Promise.reject({ error: 'invalid information' });
      }
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (!isValid) {
        return Promise.reject({ error: 'invalid information' });
      }
      return db
        .select('*')
        .from('users')
        .where('email', '=', email)
        .then(user => user[0])
        .catch(err => Promise.reject('wrong credential'));
    })
    .catch(err => res.status(400).json(err));
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  const authToken = authorization.split('Bearer ')[1];

  return redisClient.get(authToken, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json(reply);
    }

    return res.json({ id: reply });
  });
};

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};
const createToken = email => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, 'supersecrettoken', { expiresIn: '2h' });
};
const createSession = ({ email, id }) => {
  const token = createToken(email);
  return setToken(token, id)
    .then(() => ({ msg: 'success', userId: id, token }))
    .catch(console.log);
};

const singinAuthentication = (req, res, db, bcrypt) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res)
    : signinHandller(req, res, db, bcrypt)
        .then(data => {
          return data.id && data.email
            ? createSession(data)
            : Promise.reject(data);
        })
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err));
};

module.exports = {
  singinAuthentication,
  redisClient
};
